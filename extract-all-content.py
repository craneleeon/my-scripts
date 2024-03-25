#!/opt/homebrew/bin/python3

import argparse
import os

def extract_and_combine_file_contents(root_dir, extensions, output_file, ignore_dirs):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(root_dir, topdown=True):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]  # Ignore specified directories
            for file in files:
                if file.endswith(tuple(extensions)):
                    filepath = os.path.join(root, file)
                    outfile.write(f"// File: {os.path.relpath(filepath, start=root_dir)}\n\n")
                    with open(filepath, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read())
                    outfile.write("\n--- End of File ---\n\n")

def main():
    parser = argparse.ArgumentParser(description="Extract and combine source code into one file.")
    parser.add_argument("root_dir", nargs='?', default='.', help="Root directory to search for source files.")
    parser.add_argument("-o", "--output", default="output-all-code-in-one.txt", help="Output file name.")
    parser.add_argument("-t", "--types", nargs='+', default=['.ts', '.tsx'], help="File extensions to include. Example: -t .ts .tsx")
    parser.add_argument("--ignore", nargs='+', default=['node_modules', '.git'], help="Directories to ignore. Example: --ignore node_modules .git")
    args = parser.parse_args()

    extract_and_combine_file_contents(args.root_dir, args.types, args.output, args.ignore)

    print(f"Combined code written to {args.output}")

if __name__ == "__main__":
    main()

