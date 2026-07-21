from pypdf import PdfReader

reader = PdfReader("test.pdf")

text = ""

for page in reader.pages:
    text += page.extract_text()

print(f"Number of pages: {len(reader.pages)}")
print(f"Total characters extracted: {len(text)}")
print(text)