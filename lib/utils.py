import json
import shutil
from pathlib import Path


def get_working_dir():
    return Path.cwd()

def clean_directory(directory_path):
    target = f'{get_working_dir()}/{directory_path}'

    try:
        shutil.rmtree(f'{target}')
        print(f'NICE: {target} cleaned.')
    except Exception as e:
        print(f'FAILED to remove: {target}')

def output_to_file(foldername, filename, result):
    '''
    Accepts a dictionary!!!
    '''
    directory = f'{get_working_dir()}/{foldername}'
    file_path = f'{directory}/{filename}.json'

    try:
        # Create directory if not exists
        Path(directory).mkdir(parents=True, exist_ok=True)

        # Write result to file
        with open(file_path, 'w') as f:
            json.dump(result, f, indent=4)
        print(f"NICE: {file_path} created.")
    except Exception as e:
        print(f'FAILED: creating {file_path}: {e}')


