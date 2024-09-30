import os

from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()


def nagaai(prompt):
    # Ensure this is stored in your GitHub secrets
    api_key = os.getenv('NAGA_AI_API_KEY')

    client = OpenAI(base_url='https://api.naga.ac/v1', api_key=api_key)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Failed to grade the code: {str(e)}")
        return "Code could not be graded."
