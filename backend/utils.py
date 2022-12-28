import os
import click
import uuid

def cprint(*args, color = 'green'):
    click.secho(", ".join(map(lambda x: str(x), args)), fg=color)

def unique_filename(extension, directory = None):
    gen_file_name = lambda : f"{str(uuid.uuid1()).replace('-','_')}.{extension}"
    file_name =  gen_file_name()
    cprint(file_name)
    if directory:
        while(os.path.isfile(os.path.join(directory, file_name))):
            file_name = gen_file_name()
    return file_name

def unique_id():
    return str(uuid.uuid1())
