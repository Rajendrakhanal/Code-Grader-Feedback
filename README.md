# Code Grader Feedback

## Overview

Code Grader Feedback is an automated code evaluation system which  provides detailed feedback on code written in various programming languages, including Python, C, C++, JavaScript, Rust, and SQL. The system leverages the Meta LLaMA model, fine-tuned with LoRA (Low-Rank Adaptation), for efficient code analysis and feedback generation.

Key components of the project:

- Frontend: Built with React.
- Backend: Powered by FastAPI.
- Feedback focuses on improving code quality, readability, maintainability, and adherence to coding standards.

## Features

- **Code Evaluation**: Provides detailed feedback on structure, complexity, and performance.
- **Readability Improvement**: Suggestions to enhance code readability and maintainability.
- **Refactoring Recommendations**: Guidance on simplifying code and reducing complexity.
- **Compliance with Coding Standards**: Ensures code follows industry-standard conventions.
- **Future Enhancements**:
  - Grading system to evaluate code performance.
  - Expanded feedback support for additional programming languages.

## Dataset

The project uses **The Stack** dataset from the **BigCode Project**, containing over 6TB of source code files across 358 programming languages. This comprehensive dataset is ideal for multi-language code analysis.

### Key Features

- **Languages**: 358 programming languages.
- **Data**: Over 6TB of source code files.
- **Metadata**: Includes file content, size, language, and repository details.
- **Quality**: License-filtered and deduplicated for clean data.

For more details, visit [Hugging Face: The Stack Dataset](https://huggingface.co/datasets/bigcode/the-stack).

## Model Fine-Tuning

In Code Grader Feedback, we have fine-tune the [**Meta LLaMA 2**](https://huggingface.co/meta-llama) model using [**LoRA (Low-Rank Adaptation)**](https://arxiv.org/abs/2106.09685) and **Quantized LoRA (QLoRA)** for efficient performance in code analysis tasks. The summary of the key steps involved in the fine-tuning process.

### Fine-Tuning Steps

1. **Dataset Preparation**:

   - We use the [**"bigcode/the-stack"**](https://huggingface.co/datasets/bigcode/the-stack) dataset, focusing on Python files.
   - The dataset is streamed using the `datasets` library to handle large data without overloading memory:

     ```python
     from datasets import load_dataset

     dataset = load_dataset("bigcode/the-stack", data_dir="data/python", split="train", streaming=True)
     file_count = 0
     max_files = 80000
     downloaded_samples = []

     for sample in dataset:
         if file_count >= max_files:
             break
         downloaded_samples.append(sample)
         file_count += 1
     ```

   - Processed samples are converted into a structured Hugging Face dataset:

     ```python
     from datasets import Dataset

     data_dict = {"content": downloaded_samples}
     dataset = Dataset.from_dict(data_dict)
     ```

2. **Model and Tokenizer Configuration**:

   - The model is loaded with **QLoRA** to reduce memory usage with 4-bit quantization:

     ```python
     from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

     bnb_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_use_double_quant=False)
     model = AutoModelForCausalLM.from_pretrained("meta-llama/llama-2", quantization_config=bnb_config, device_map="auto")
     tokenizer = AutoTokenizer.from_pretrained("meta-llama/llama-2", padding_side="right")
     ```

   - The tokenizer is set up to handle padding appropriately:

     ```python
     tokenizer.pad_token = tokenizer.eos_token
     ```

3. **Merging LoRA Weights**:

   - LoRA weights are merged into the base model using the `PeftModel`:

     ```python
     from peft import PeftModel

     peft_model = PeftModel.from_pretrained(model, "lora-finetuned-model")
     peft_model.merge_and_unload()  # Merge LoRA weights into the base model
     ```

4. **Final Model Loading**:

   - The fine-tuned and merged model is loaded for inference using **FP16 precision** for memory efficiency:

     ```python
     model = AutoModelForCausalLM.from_pretrained("fine-tuned-llama-model", torch_dtype=torch.float16, device_map="auto")
     tokenizer = AutoTokenizer.from_pretrained("fine-tuned-llama-model")
     ```

   - The tokenizer is configured to align token sequences correctly:

     ```python
     tokenizer.pad_token = tokenizer.eos_token
     tokenizer.padding_side = "right"
     ```

For more details and the full fine-tuning process, refer to the [notebook/](./notebook/Code_Grader_Feedback_Fine_Tuning.ipynb) directory.

### Using ChatGPT for Code Grading

In this project, we integrated **ChatGPT** to streamline the code grading process. ChatGPT evaluates submitted code based on several key criteria:

- **Correctness**: Does the code solve the problem as expected? (20 points max)
- **Efficiency**: How optimized is the code in terms of time and space complexity? (15 points max)
- **Code Structure**: Is the code modular and well-organized? (10 points max)
- **Readability**: Is the code easy to understand and maintain? (10 points max)
- **Error Handling**: Does the code handle potential errors and edge cases? (10 points max)
- **Other Factors**: Including reusability, testing, documentation, adherence to standards, and innovation (35 points total).

Based on these criteria, ChatGPT returns a **final score out of 100**, ensuring consistent and unbiased grading.

## Project Structure

The project is organized as follows:

```bash
code-grader-feedback/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry point and API logic
│   └── requirements.txt            # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Main React component
│   │   ├── components/             # Reusable React components
│   │   ├── pages/                  # Different page views (Homepage, LandingPage)
│   │   ├── constants/              # Static constants (styles, options)
│   │   ├── routes/                 # Navigation route configurations
│   │   └── types/                  # TypeScript type definitions
│   ├── package.json                # Frontend dependencies and scripts
│   ├── postcss.config.js           # PostCSS configuration for styles
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── vite.config.ts              # Vite configuration for frontend bundling
│
├── notebook/
│   └── Code_Grader_Feedback_Fine_Tuning.ipynb  # Jupyter notebook for model fine-tuning
│
└── README.md                       # Main README file with project information
```

## Installation

Follow the steps below to set up and run the Code Grader Feedback system on your local machine.

### 1. Clone the Repository

Start by cloning the project repository from GitHub:

```bash
git clone https://github.com/fuseai-fellowship/code-grader-feedback.git
cd code-grader-feedback
```

### 2. Install Frontend Dependencies

Navigate to the `frontend` directory and install the required Node.js dependencies:

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Navigate to the `backend` directory, set up a virtual environment for Python, and install the necessary dependencies:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```

### 4. Configure Judge0 API

To enable code compilation, set up the Judge0 API by following these steps:

1. **Go to [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce).**
2. **Subscribe to the Basic Plan** to access the Judge0 API.
3. **Retrieve your API keys** from the RapidAPI dashboard, which include:
   - **RAPIDAPI_HOST**
   - **RAPIDAPI_KEY**

### 5. Set Up Environmental Variables

You need to configure environment variables for both the frontend and backend. Follow the steps below for each:

#### Frontend:

1. Navigate to the `frontend` directory and create a `.env` file.
2. Add the following variables:

   ```env
   VITE_API_URL=http://localhost:8000
   VITE_APP_RAPID_API_HOST=<your-rapidapi-host>
   VITE_APP_RAPID_API_KEY=<your-rapidapi-key>
   VITE_APP_RAPID_API_URL=https://judge0-ce.p.rapidapi.com/submissions
   ```

   Replace `<your-rapidapi-host>` and `<your-rapidapi-key>` with the values from your Judge0 RapidAPI account.

#### Backend:

1. Navigate to the `backend` directory and create a `.env` file.
2. Add the following variable:

   ```env
   FRONTEND_ORIGIN=http://localhost:5173
   ```

For detailed instructions on setting up the environment variables, refer to the [Setting Up Environmental Variables](./environmental-setup.mdx) section.

### 6. Run the Frontend

Ensure your environment variables are configured properly, and the dependencies are installed. To start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 7. Run the Backend

Ensure your virtual environment is activated, and the necessary environment variables are set up. To run the FastAPI backend server:

```bash
uvicorn app.main:app --reload
```

The backend server will run at `http://localhost:8000`.

## Contributing Guidelines

We appreciate your contributions! Follow these steps to get started:

### Steps to Contribute

1. **Fork and Clone**  
   Fork the repository and clone it locally:

   ```bash
   git clone https://github.com/<your-username>/code-grader-feedback.git
   cd code-grader-feedback
   ```

2. **Create a Branch**  
   Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes and Commit**  
   Make your changes and commit:

   ```bash
   git commit -am "Describe your changes"
   ```

4. **Push and Submit PR**  
   Push your branch and submit a pull request:

   ```bash
   git push origin feature/your-feature-name
   ```

A project maintainer will review and merge your changes.
