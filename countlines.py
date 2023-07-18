#!/usr/bin/env python3

import os
import sys
import subprocess

folder_path = sys.argv[1]
exclude_dirs = {"node_modules", ".git"}  # Add directories to exclude here
total_lines = 0

# Use os.walk to get all files in the directory and subdirectories
for dirpath, dirnames, filenames in os.walk(folder_path):
    # Skip directories in the exclude list
    dirnames[:] = [d for d in dirnames if d not in exclude_dirs]

    for file in filenames:
        file_path = os.path.join(dirpath, file)

        # If .git directory exists, only count tracked files
        with open(file_path, 'r') as f:
            lines_in_file = len(f.readlines())
            total_lines += lines_in_file

print(f"Total lines: {total_lines}")

