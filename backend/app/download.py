import kagglehub

kagglehub.login()

# Download latest version
path = kagglehub.model_download("rajendra143/fine-tuned-code-grader/transformers/default")

print("Path to model files:", path)