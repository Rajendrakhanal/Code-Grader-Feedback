from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
# from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
# from peft import PeftModel
# import torch
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import re
import os
from typing import Optional
from .nagaai import nagaai


import logging
logger = logging.getLogger('uvicorn.error')

load_dotenv()

# Define FastAPI app
app = FastAPI()

frontend_origin = os.getenv("FRONTEND_ORIGIN")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],  # Allow origin from .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer outside of the endpoint to avoid reloading them with each request
model_name = os.environ['HOME'] + \
    "/.cache/kagglehub/models/rajendra143/fine-tuned-code-grader/transformers/default/1"
# Load the base model (merged with LoRA)
# model = AutoModelForCausalLM.from_pretrained(
#     model_name,
#     torch_dtype=torch.float16,  # Use torch.float32 if fp16 is not supported
#     low_cpu_mem_usage=True,
#     device_map="auto",
# )
# print(model.device, "is model device")

# # Load the tokenizer
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# tokenizer.pad_token = tokenizer.eos_token
# tokenizer.padding_side = "right"

# # Create the pipeline for text generation
# pipe = pipeline(
#     task="text-generation",
#     model=model,
#     tokenizer=tokenizer,
#     max_length=500,
#     truncation=True  # Explicitly set truncation
# )
# print(pipe.device, "is pipeline device")

# def extract_llm_response(text):
#     # Define the regex pattern
#     pattern = r'\[/INST\].*?([\s\S]*)'  # Matches everything after [/INST]

#     # Use re.DOTALL to allow the dot to match newlines
#     match = re.search(pattern, text, re.DOTALL)

#     # Return the response if found, else return None
#     return match.group(1).strip() if match else None

# Define a request body model


class CodeInput(BaseModel):
    code: str
    question: Optional[str]
    language: Optional[str]

# Create an API endpoint for text generation


@app.post("/generate-feedback")
async def generate_text(input_data: CodeInput):
    try:
        # Extract the code from the input
        code = input_data.code
        question = input_data.question
        language = input_data.language

        # Prepare the prompt
        prompt = (
            f'''[INST] You are a chatbot to evaluate a given coded assignment under a given question in a particular language following the feedback guidelines.

### Feedback Guidelines:
1. Is the coded answer correct for the given question?
2. Can code be simplified further?
3. Can code be refactor to improve the structure?
4. How modular is the code, and how stable is it?
5. Does code adhere to industry standard conventions?

### Input Information:

    - **Question**: **{question}**
    - **Programming Language**: `{language}`
    - **User's Code**:
    ```
    {code}
    ```

### Instructions:
    - Mention only those points that are relavant for the context and important to mention. Keep feedback as short as possible.
    - Ensure feedback is easy to understand and actionable.
[/INST]
 ''')

        print(prompt)
        print("Status: Running generation")

        return {"generated_text": "We are working to connect to the model"}

        # Run text generation
        result = pipe(prompt)

        print("Generated output:")
        print(result)

        # Return the generated text
        return {"generated_text": extract_llm_response(result[0]['generated_text'])}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/grade-the-code")
async def code_grader(params: CodeInput):

    try:
        code = params.code

        print(code)

        grading_prompt = f"""
        Please evaluate the provided code based on the following criteria, and return only the final total score out of 100. Do not provide individual scores or any additional comments, just the final score.

        Grading Criteria:
        1. Correctness (20 points max)
        2. Efficiency (15 points max)
        3. Code Structure and Organization (10 points max)
        4. Readability and Maintainability (10 points max)
        5. Error Handling (10 points max)
        6. Reusability (5 points max)
        7. Testing (10 points max)
        8. Documentation (5 points max)
        9. Adherence to Standards (5 points max)
        10. Innovation and Creativity (10 points max)

        Return the total score only in this format:
        Final Score: X/100

        Here is the code to evaluate:

        {code}
        """

        code_graded_score = nagaai(grading_prompt)

        return code_graded_score
    except Exception as E:
        print(f"Some error occured while grading the code.\n Error: {E}")

