from fastapi import FastAPI, HTTPException
import uvicorn
import os
import json
from pydantic import BaseModel
from typing import Dict, Optional
import commune as c 
# Pydantic model for module dat
import requests
import requests
from .utils import load_json, save_json, logs

class Hub:
    server_port = 8000
    app_port = 3000
    app_name =  __file__.split('/')[-3] + '_app' 
    model='anthropic/claude-3.5-sonnet'
    free = True
    endpoints = ["get_modules", 
                'modules', 
                'add_module', 
                'remove', 
                'update', 
                'test', 
                'info', 
                'functions']
    modules_path = __file__.replace(__file__.split('/')[-1], 'modules')
    
    def get_module_path(self, module):
        return f"{self.modules_path}/{module}.json"

    def ls(self, path=modules_path):
        if not os.path.exists(path):
            print('WARNING IN LS --> Path does not exist:', path)
            return []
        path = os.path.abspath(path)
        return c.ls(path)

    def logs(name):
        return c.logs(name)

    def check_module(self, module):
        features = ['name', 'url', 'key']  
        if isinstance(module, str):
            module = self.get_module(module)
        if not isinstance(module, dict):
            return False
        return True

    def check_modules(self):
        checks = []
        for m in self.modules():
            try:
                self.check_module(m)
                m['check'] = True
            except Exception as e:
                print(e)
                m['check'] = False
            checks += [m]
        return checks

    def save_module(self, module):
        self.check_module(module)
        module_path = self.get_module_path(module["key"])
        save_json(module_path, module)
        return {"message": f"Module {module['key']} updated successfully"}

    def clear_modules(self):
        for module_path in self.ls(self.modules_path):
            print('Removing:', module_path)
            os.remove(module_path)
        return {"message": "All modules removed"}
    
    def resolve_path(self, path):
        return '~/.hub/api/' + path

    def modules(self, tempo=600, update=False, lite=True, page=1, page_size=100, verbose=False):
        modules =  c.get_modules() 
        path = self.resolve_path('modules')
        module_infos = c.get(path,[], max_age=tempo, update=update)
        modules = c.modules()
        progress = c.tqdm(modules, desc="Loading modules", unit="module")
        if len(module_infos) > 0:
            return module_infos
        else:
            # return modules
            modules = sorted(modules, key=lambda x: x.lower())
            for module in modules:
                try:
                    module_infos += [self.get_module(module, lite=lite)]
                    progress.update(1)
                except Exception as e:
                    if verbose:
                        print(e)
        

        c.put(path, module_infos)


        return module_infos

    def get_module(self, module:str, lite=True):

        code = c.code(module)
        hash_code = c.hash(code)
        key = c.pwd2key(hash_code)
        module_info = {'name': module, 
            'code': code,
            'key': key.ss58_address, 
            'crypto_type': key.crypto_type ,
            'hash': hash_code, 
            'time': c.time(),
            }
        if not lite:
            module_info.pop('code')
        return module_info

    def add_module(self, name  = "module", 
                   key  = "module_key", 
                   code = None, 
                   url  = "0.0.0.0:8000", 
                   **kwargs ):
        
        module = { "name": name, "url": url, "key": key, "code": code, }
        self.save_module(module)
        result =  {"message": f"Module {module['name']} added successfully", "module": module}
        print('RESULT',result)
        return result

    def root():
        return {"message": "Module Management API"}


    def remove(self, module: str):
        assert self.module_exists(module), "Module not found"
        os.remove(self.get_module_path(module))
        return {"message": f"Module {module} removed successfully"}

    def module_exists(self, module: str):
        return os.path.exists(self.get_module_path(module))

    def update(self, module: str):
        if not self.module_exists(module):
            raise HTTPException(status_code=404, detail="Module not found")
        module = self.get_module(module)
        
        self.save_module(module, module)

    def test(self):
        
        # Test module data
        test_module = {
            "name": "test_module",
            "url": "http://test.com",
            "key": "test_key",
            "key_type": "string",
            "description": "Test module description"
        }
        # Add module
        self.add_module(test_module)
        assert self.module_exists(test_module['name']), "Module not added"
        self.remove_module(test_module['name'])
        assert not self.module_exists(test_module['name']), "Module not removed"
        return {"message": "All tests passed"}
    
    def serve(self, port=server_port):
        return c.serve(self.module_name(), port=port)
    
    def kill_app(self, name=app_name, port=app_port):
        while c.port_used(port):
            c.kill_port(port)
        return c.kill(name)
    

    def query(self,  
              options : list,  
              query='most relevant files', 
              output_format="list[[key:str, score:float]]",  
              anchor = 'OUTPUT', 
              threshold=0.5,
              n=10,  
              model=model):

        front_anchor = f"<{anchor}>"
        back_anchor = f"</{anchor}>"
        output_format = f"DICT(data:{output_format})"
        print(f"Querying {query} with options {options}")
        prompt = f"""
        QUERY
        {query}
        OPTIONS 
        {options} 
        INSTRUCTION 
        get the top {n} functions that match the query
        OUTPUT
        (JSON ONLY AND ONLY RESPOND WITH THE FOLLOWING INCLUDING THE ANCHORS SO WE CAN PARSE) 
        {front_anchor}{output_format}{back_anchor}
        """
        output = ''
        for ch in c.ask(prompt, model=model): 
            print(ch, end='')
            output += ch
            if ch == front_anchor:
                break
        if '```json' in output:
            output = output.split('```json')[1].split('```')[0]
        elif front_anchor in output:
            output = output.split(front_anchor)[1].split(back_anchor)[0]
        else:
            output = output
        output = json.loads(output)
        assert len(output) > 0
        return [k for k,v in output["data"] if v > threshold]

    def files(self, query='the file that is the core of commune',  path='./',  n=10, model='anthropic/claude-3.5-sonnet-20240620:beta'):
        files =  self.query(options=c.files(path), query=query, n=n, model=model)
        return [c.abspath(path+k) for k in files]
    
    networks = ['ethereum',
                 'bitcoin', 
                 'solana', 
                 'bittensor', 
                 'commune']
    def is_valid_network(self, network):
        return network in self.networks
    
    def get_key(self, password, **kwargs):
        return c.str2key(password, **kwargs)

    def feedback(self, path='./',  model=model):
        code = c.file2text(path)
   
        prompt = f"""

        PROVIDE FEEDBACK and s a score out of 100 for the following prompt on quality 
        and honesty. I want to make sure these are legit and there is a good chance 
        they are not. You are my gaurdian angel.
        {code}        
        OUTPUT_FORMAT MAKE SURE ITS IN THE LINES
        <OUTPUT><DICT(pointers:str, score:int (out of 100))></OUTPUT>
        OUTPUT
        """

        return c.ask(prompt, model=model)


    def file2text(owner: str, repo: str, filepath: str, branch: str = 'main') -> str:
        """
        Get the text contents of a file in a GitHub repository without using the GitHub API.
        This uses the raw.githubusercontent.com domain to fetch the file content directly.
        
        Parameters:
            owner (str): Repository owner/organization
            repo (str): Repository name
            filepath (str): Path to the file within the repository
            branch (str): The branch to read from (default: 'main')
            
        Returns:
            str: The text content of the file.
        """
        raw_url = f'https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{filepath}'
        response = requests.get(raw_url)
        response.raise_for_status()
        return response.text