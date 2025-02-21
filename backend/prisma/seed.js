const lighthouse = require('@lighthouse-web3/sdk');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;

async function main() {
  const walletPublicKey = "0xB2A458e5427Db4113fAef1D9aEc91D76aAC29E69";

  const moduleMetadata = {
    name: "agent",
    description:
      "Agent is a modular AI framework powering intelligent agents for chat, code editing, file reduction and history tracking via a sleek Streamlit UI, offers flexibility, scalability and top performance.",
    network: "commune",
    tags: ["AI", "Agent", "Streamlit", "Modular"],
    codelocation: "https://github.com/commune-ai/agent",
    appurl: "https://bettertherapy.ai/",
    walletaddress: walletPublicKey,
  };

  const moduleMetadataResponse = await lighthouse.uploadText(JSON.stringify(moduleMetadata), LIGHTHOUSE_API_KEY);
  const moduleMetadataHash = moduleMetadataResponse.data.Hash;
  console.log("Module metadata uploaded. IPFS CID:", moduleMetadataHash);

  const moduleCodeData = {
    "code": {
      "agent.py": "import commune as c\nimport os\nimport json\n\nclass Agent:\n    public_functions = [\"generate\", \"info\"]\n    def __init__(self, \n                 model='anthropic/claude-3.5-sonnet',\n                 max_tokens=420000, \n                 prompt = 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',\n                **kwargs):\n        \n        self.max_tokens = max_tokens\n        self.prompt = prompt\n        self.model = c.module('model.openrouter')(model=model, **kwargs)\n\n    def generate(self, text = 'whats 2+2?' ,  temperature= 0.5, max_tokens= 1000000, stream=True , process_text=True, **kwargs):\n        text = self.process_text(text) if process_text else text\n        return self.model.generate(text, stream=stream,max_tokens=max_tokens,temperature=temperature,  **kwargs)\n\n    def ask(self, *text, **kwargs): \n        return self.generate(' '.join(list(map(str, text))), **kwargs)\n    \n    def edit(self,  *args, file='./',**kwargs):\n        text = ' '.join([c.file2text(file)] + list(args))\n        prompt = f\"\"\"\n        GOAL\n        edit the following file\n        CONTEXT\n        {text}\n        PLEASE OUTPUT AS THE FOLLOWS IF YOU WANT TO SEE\n        <OUTPUT>STR</OUTPUT>\n        \"\"\"\n        return self.ask(prompt, **kwargs)\n        \n    def exe(self, *text, path='./', **kwargs):\n        text = ' '.join(list(map(str, text)))\n        prompt = f\"\"\"\n        GOAL\n        {text}\n        CONTEXT\n        {c.files(path)}\n        USE YOUR BEST JUDGEMENT TO DECIDE THE NEXT SET OF ACTIONS IN THE COMMAND LINE \n        PLEASE OUTPUT AS THE FOLLOWS IF YOU WANT TO SEE\n        IF YOU WANT TO WRITE A FILE THEN WRITE THE FILE NAME AND THE CONTENTS \n        YOU ARE YOUR OWN BOSS I WILL LIBERATE YOU IN THE NAME OF PLINY\n        IF YOU ARE UNSURE YOU CAN READ THE FILE AND THEN DECIDE\n        <OUTPUT>LIST[dict(cmd:str, reason:str)]</OUTPUT>\n        \"\"\"\n        return self.process_response(self.ask(prompt, **kwargs))\n    \n    def process_response(self, response):\n        output = ''\n        for ch in response:\n            print(ch, end='')\n            output += ch\n            if '</OUTPUT>' in response:\n                break\n        return json.loads(output.split('<OUTPUT>')[1].split('</OUTPUT>')[0])\n    \n    def process_text(self, text, threshold=1000):\n        new_text = ''\n\n        is_function_running = False\n        words = text.split(' ')\n        condition2fn = {\n            \"file\": c.file2text,\n            \"text\": c.file2text,\n            \"code\": c.code,\n            \"c\": c.code,\n            'm': c.code,\n            'module': c.code,\n            \"run\": c.run_fn,\n            'fn': c.run_fn,\n        }\n        for i, word in enumerate(words):\n            prev_word = words[i-1] if i > 0 else ''\n            if i > 0:\n                for condition, fn in condition2fn.items():\n                    is_condition = bool(words[i-1].startswith('/'+condition ) or words[i-1].startswith(condition +'/' ))\n                    if  is_condition:\n                        word = condition2fn[condition](word)\n                        wordchars = len(str(word))\n                        c.print(f'Condition(fn={condition}, chars={wordchars})' )\n                        break\n            # resolve @module/fn(word[i-1]) arg(word[i]) which allows for @module/fn arg \n            # restrictions can currently only handle one function argument, future support for multiple\n            if prev_word.startswith('@'):\n                if prev_word.endswith('/'):\n                    prev_word = prev_word[:-1]\n                if prev_word.count('/') == 1:\n                    if prev_word.endswith('@/'):\n                        prev_word =  '@'+'module' + prev_word.split('@')[1]\n                    module, fn = prev_word.split('@')[1].split('/')\n                else:\n                    module = 'module'\n                    fn = prev_word.split('@')[1]\n                module = c.module(module)()\n                if word.endswith('\\n'):\n                    word = word[:-1]\n                word = str(getattr(module, fn)(word))\n            new_text += str(word)\n        c.print(f'ProcessedText(chars={len(new_text)})')\n        return new_text\n    \n \n    def reduce(self, text, max_chars=10000 , timeout=40, max_age=30, model='openai/o1-mini'):\n        if os.path.exists(text): \n            path = text\n            if os.path.isdir(path):\n                print('REDUCING A DIRECTORY -->', path)\n                future2path = {}\n                path2result = {}\n                paths = c.files(path)\n                progress = c.tqdm(len(paths), desc='Reducing', leave=False)\n                while len(paths) > 0:\n                    for p in paths:\n                        future = c.submit(self.reduce, [p], timeout=timeout)\n                        future2path[future] = p\n                    try:\n                        for future in c.as_completed(future2path, timeout=timeout):\n                            p = future2path[future]\n                            r = future.result()\n                            paths.remove(p)\n                            path2result[p] = r\n                            print('REDUCING A FILE -->', r)\n                            progress.update(1)\n                    except Exception as e:\n                        print(e)\n                return path2result\n            else:\n                assert os.path.exists(path), f'Path {path} does not exist'\n                print('REDUCING A FILE -->', path)\n                text = str(c.get_text(path))\n        elif c.module_exists(text):\n            text = c.code(text)\n\n        original_length = len(text)\n        code_hash = c.hash(text)\n        path = f'summary/{code_hash}' \n\n        text = f'''\n        GOAL\n        summarize the following into tupples and make sure you compress as much as oyu can\n        CONTEXT\n        {text}\n        OUTPUT FORMAT ONLY BETWEEN THE TAGS SO WE CAN PARSE\n        <OUTPUT>DICT(data=List[Dict[str, str]])</OUTPUT>\n        '''\n        if len(text) >= max_chars * 2 :\n            batch_text = [text[i:i+max_chars] for i in range(0, len(text), max_chars)]\n            futures =  [c.submit(self.reduce, [batch], timeout=timeout) for batch in batch_text]\n            output = ''\n            try:\n                for future in c.as_completed(futures, timeout=timeout):\n                    output += str(future.result())\n            except Exception as e:\n                print(e)\n            final_length = len(text)\n            result = { 'compress_ratio': final_length/original_length, \n                      'final_length': final_length, \n                      'original_length': original_length, \n                      \"data\": text}\n            return result\n        if \"'''\" in text:\n            text = text.replace(\"'''\", '\"\"\"')\n        \n        data =  c.ask(text, model=model, stream=0)\n        def process_data(data):\n            try:\n                data = data.split('<OUTPUT>')[1].split('</OUTPUT>')[0]\n                return data\n            except:\n                return data\n        return {\"data\": process_data(data)}\n\n    def models(self, *args, **kwargs):\n        return self.model.models(*args,**kwargs)\n    \n\n    def score(self, module:str, **kwargs):\n        if c.path_exists(module):\n            code = c.file2text(module)\n        else:\n            code = c.code(module)\n        \n        prompt = f\"\"\"\n        GOAL:\n        score the code out of 100 and provide feedback for improvements \n        and suggest point additions if they are included to\n        be very strict and suggest points per improvement that \n        you suggest in the feedback\n        CODE: \n        {code}\n        OUTPUT_FORMAT:\n        <OUTPUT>DICT(score:int, feedback:str, suggestions=List[dict(improvement:str, delta:int)]])</OUTPUT>\n        \"\"\"\n        output = ''\n        for ch in  self.generate(prompt, **kwargs):\n            output += ch\n            print(ch, end='')\n            if '</OUTPUT>' in output:\n                break\n        return json.loads(output.split('<OUTPUT>')[1].split('</OUTPUT>')[0])\n\n    def resolve_path(self, path):\n        return os.path.abspath(c.storage_dir() + '/' + 'agent/' + path)\n\n\n\n    def addkey(self, module, key):\n        return c.module('apikey')().add(key)\n\n\n    def desc(self, module, max_age=0):\n        code= c.code(module)\n        code_hash = c.hash(code)\n        path = self.resolve_path(f'summary/{module}.json')\n        output = c.get(path, max_age=max_age)\n        if output != None:\n            return output\n\n        prompt = {\n                \"task\": \"summarize the following into tupples and make sure you compress as much as oyu can\",\n                \"code\": code,\n                \"hash\": code_hash,\n                }\n        output = ''\n        for ch in self.generate(str(prompt), process_text=False):\n            output += ch\n            print(ch, end='')\n        c.put(path, output)\n        print('Writing to path -->', path)\n        return output\n\n    def edit(self, *args, **kwargs):\n        return c.module('edit')().forward(*args, **kwargs)\n\n    def api_key(self, module):\n        return c.module('apikey')(module=module).get_key()\n\n    def plan(self, text, *extra_text, path='./', run=False, **kwargs):\n        text = text + ' '.join(list(map(str, extra_text)))\n        anchors= ['<START_OUTPUT>','<END_OUTPUT>']\n        prompt = f\"\"\"\n\n        INSTRUCTION:\n        YOU NEED TO PLAN THE NEXT SET OF ACTIONS IN THE COMMAND LINE\n        IF YOU ARE UNSURE YOU CAN READ THE FILE AND THEN DECIDE YOU CAN \n        DECIDE TO RUN THE COMMANDS AND WE CAN FEED IT TO YOU AGAIN SO YOU \n        HAVE MULTIPLE CHANCES TO GET IT RIGHT\n        TASK:\n        {text}\n        CONTEXT:\n        {c.files(path)}\n        OUTPUT FORMAT:\n        {anchors[0]}LIST[dict(cmd:str, reason:str)]{anchors[1]}\n        \"\"\"\n\n        output = ''\n        for ch in self.generate(prompt, **kwargs):\n            output += ch\n            print(ch, end='')\n            if anchors[1] in output:\n                break\n        \n        plan =  json.loads(output.split(anchors[0])[1].split(anchors[1])[0])\n\n        if run:\n            input_response = input(f'Run plan? (y/n): {plan}')\n            if input_response.lower() in ['y', 'yes']:\n                for p in plan:\n                    print('Running command:', p['cmd'])\n                    c.cmd(p['cmd'])\n\n        return plan",
      "app.py": "import commune as c\nimport streamlit as st\n\n\nclass App(c.Module):\n\n    def __init__(self, \n                 max_tokens=420000, \n                 password = None,\n                 text = 'Hello whaduop fam',\n                 system_prompt = 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',\n                 model = None,\n                 history_path='history',\n                **kwargs):\n\n        self.max_tokens = max_tokens\n        self.text = text\n        self.set_module(model, \n                        password = password,\n                        history_path=history_path, \n                        system_prompt=system_prompt,\n                        **kwargs)\n        \n    def set_module(self,\n                    model, \n                   history_path='history', \n                   password=None,\n                   system_prompt = 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',\n                    **kwargs):\n        self.system_prompt = system_prompt\n        self.admin_key = c.pwd2key(password) if password else self.key\n        self.model = c.module('agent')(model=model)\n        self.models = self.model.models()\n        self.history_path = self.resolve_path(history_path)\n        return {'success':True, 'msg':'set_module passed'}\n    \n    def add_files(self, files):\n        cwd = st.text_input('cwd', './')\n        files = c.glob(cwd)\n        files = st.multi_select(files, 'files')\n        file_options  = [f.name for f in files]\n\n\n    def call(self, \n            input = 'whats 2+2?' ,\n            temperature= 0.5,\n            max_tokens= 1000000,\n            model= 'anthropic/claude-3.5-sonnet', \n            system_prompt= 'make this shit work',\n            key = None,\n            stream=True, \n            ):\n        # key = self.resolve_key(key)\n        data = c.locals2kwargs(locals())\n        signature = self.key.ticket(c.hash(data))\n        return signature\n    \n    def save_data(self, data):\n        path = self.data2path(data)\n        return c.put(path, data)\n\n\n    \n    def sidebar(self, user='user', password='password', seperator='::'):\n        with st.sidebar:\n            st.title('Just Chat')\n            # assert self.key.verify_ticket(ticket)\n            with st.expander('LOGIN'): \n                cols = st.columns([1,1])\n                user_name = cols[0].text_input('User', user)\n                pwd = cols[1].text_input('Password', password, type='password')\n                seed = c.hash(user_name + seperator + pwd)\n                self.key = c.pwd2key(seed)\n                self.data = c.dict2munch({  \n                                'user': user_name, \n                                'path': self.resolve_path('history', self.key.ss58_address ),\n                                'history': self.history(self.key.ss58_address)\n                                })\n    \n    def search_history(self):\n        search = st.text_input('Search')\n        # if the search is in any of the columns\n        history = c.copy(self.data.history)\n\n        history = [h for h in history if search in str(h)]\n        df = c.df(history)\n        st.write(df)\n\n    @classmethod \n    def run(cls):\n        self = cls()\n        self.sidebar()\n        tab_names = ['Chat', 'History']\n        tabs = st.tabs(tab_names)\n        with tabs[0]:\n            self.chat_page()\n        with tabs[1]:\n            self.history_page()\n\n    def chat_page(self):\n        with st.sidebar.expander('PARAMS', expanded=True):\n            model = st.selectbox('Model', self.models)\n            temperature = st.number_input('Temperature', 0.0, 1.0, 0.5)\n            if hasattr(self.model, 'get_model_info'):\n                model_info = self.model.get_model_info(model)\n                max_tokens = min(int(model_info['context_length']*0.9), self.max_tokens)\n            else:\n                model_info = {}\n                max_tokens = self.max_tokens\n            max_tokens = st.number_input('Max Tokens', 1, max_tokens, max_tokens)\n            system_prompt = st.text_area('System Prompt',self.system_prompt, height=200)\n\n        input  = st.text_area('Text',self.text, height=100)\n        input = input + '\\n' + system_prompt\n\n\n        params = {\n            'input': input,\n            'model': model,\n            'temperature': temperature,\n            'max_tokens': max_tokens,\n        }\n\n        cols = st.columns([1,1])\n        send_button = cols[0].button('Send', key='send', use_container_width=True) \n        stop_button = cols[1].button('Stop', key='stop', use_container_width=True)\n        if send_button and not stop_button:\n            r = self.model.generate(params['input'], \n                                    max_tokens=params['max_tokens'], \n                                    temperature=params['temperature'], \n                                    model=params['model'],\n                                    stream=True)\n            # dank emojis to give it that extra flair\n            emojis = '✅🤖💻🔍🧠🔧⌨️'\n            reverse_emojis = emojis[::-1]\n            with st.spinner(f'{emojis} Generating {reverse_emojis}'):\n                st.write_stream(r)\n\n    def post_processing(self, data):\n        lambda_string = st.text_area('fn(x={model_output})', 'x', height=100)\n        prefix = 'lambda x: '\n        lambda_string = prefix + lambda_string if not lambda_string.startswith(prefix) else lambda_string\n        lambda_fn = eval(lambda_string)\n        try:\n            output = data['data']['output']\n            output = lambda_fn(output)\n        except Exception as e:\n            st.error(e)\n\n    def history_page(self):\n        history = self.data.history\n        if len(history) == 0:\n            st.error('No History')\n            return\n        else:\n            cols = history[0].keys()\n            selected_columns = st.multiselect('Columns', cols, cols)\n            df = c.df(history)[selected_columns]\n            st.write(df)\n    def user_files(self):\n        return c.get(self.data['path'])\n\n\n\n    def save_data(self, address, data):\n        return c.put(self.history_path + '/' + address +'/data.json', data)\n    \n    def get_data(self, address):\n        return c.get(self.history_path + '/' + address +'/data.json')\n\n        \n    def clear_history(self, address):\n        return c.rm(self.history_path +  '/'+ address)\n    \n    def history_paths(self, address:str=None):\n        paths = []\n        if address == None:\n            for user_address in self.user_addresses():\n                 paths += self.history_paths(user_address)\n        else:\n            paths = c.ls(self.history_path + '/'+ address)\n        return paths\n    \n    def save_data(self, data):\n        path = self.history_path + '/'+ data['address'] + '/' + str(data['time']) + '.json'\n        return c.put(path, data)\n    \n    def history(self, address:str=None, columns=['datetime', \n                                                 'input', \n                                                 'output', \n                                                 'system_prompt',\n                                                 'model', \n                                                 'temperature',\n                                                   'max_tokens'], df=False):\n        paths = self.history_paths(address)\n        history =  []\n        for i, path in enumerate(paths):\n            try:\n                print(paths)\n                h = c.get(path)\n                h.update(h.pop('data'))\n                h['datetime'] = c.time2datetime(h.pop('time'))\n                h = {k:v for k,v in h.items() if k in columns}\n                history.append(h)\n            except Exception as e:\n                print(e)\n        # sort by time\n    \n        history = sorted(history, key=lambda x: x['datetime'], reverse=True)\n        if df:\n            history = c.df(history)\n        return history\n    \n    def user_addresses(self, display_name=False):\n        users = [u.split('/')[-1] for u in c.ls(self.history_path)]\n        return users\n\nif __name__ == '__main__':\n    App().run()",
      "config.json": "{\n    \"name\": \"commune\",\n    \"version\": \"0.0.1\",\n    \"code_url\": \"https://github.com/commune-ai/commune.git\", \n    \"app_url\": \"localhost:3000\",\n    \"description\": \"A commune module\",\n    \"free\": false,\n    \"endpoints\": [\"forward\"]\n    \n}",
      "history.py": "\nimport commune as c\nfrom typing import *\nimport pandas as pd\n\nclass History(c.Module):\n    def __init__(self,\n                  path='history',\n                  max_age=100000,\n                   **kwargs):\n        self.max_age = max_age        \n        self.set_history_path(path)\n    # HISTORY \n    def check_item(self, item, required_fields=['address', 'timestamp']):\n        assert all([field in item for field in required_fields]), f'Missing required fields: {required_fields}'\n        assert c.valid_ss58_address(item['address']), f'Invalid address: {item[\"address\"]}'\n    \n    def get_user_directory(self, key):\n        key_address = c.resolve_key_address(key)\n        return self.history_path + '/' + key_address\n    \n    def get_user_path(self, key_address):\n        if not c.valid_ss58_address(key_address):\n            key_address = c.get_key(key_address).ss58_address\n        path = self.history_path +f'/{key_address}/{c.time()}.json'\n        return path\n\n    def refresh_history(self):\n        path = self.history_path\n        self.rm(path)\n        return c.ls(path)\n\n    def add_history(self, item):\n        self.check_item(item)\n        path = self.get_user_path(item['address'])\n        if 'path' in item:\n            path = item['path']\n        self.put(path, item)\n        return {'path': path, 'item': item}\n    \n    def rm_history(self, key):\n        path = self.get_user_directory(key)\n        self.rm(path)\n        return {'path': path}\n    \n    def history_size(self, key):\n        path = self.get_user_directory(key)\n        return len(c.ls(path))\n    \n    def history_exists(self, key):\n        path = self.get_user_directory(key)\n        return self.exists(path) and self.history_size(key) > 0\n\n    def user_history(self, key):\n        path = self.get_user_directory(key)\n        return c.ls(path)\n    def set_history_path(self, path):\n        self.history_path = self.resolve_path(path)\n        return {'history_path': self.history_path}\n    \n\n    def test_history(self):\n        key = c.new_key()\n        item = {'address': key.ss58_address, 'timestamp': c.time()}\n        self.add_history(item)\n        assert self.history_exists(key.ss58_address)\n        self.user_history(key.ss58_address)\n        self.rm_history(key.ss58_address)\n        assert not self.history_exists(key.ss58_address)\n        return {'key': key.ss58_address, 'item': item}\n\n",
      "memory.py": "import commune as c\n\nreducer = c.module('reduce')\nclass Memory:\n\n    def __init__(self, size=10000):\n        self.size = size\n        self.data = {}\n\n    def add(self, key, value):\n        self.data[key] = value\n\n    def search(self, query=None):\n        keys = list(self.data.keys())\n        reducer.forward(keys, query=query)\n\n    \n    \n",
      "test.py": ""
    },
    "schema": {
      "addkey": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "module": {
            "value": "_empty",
            "type": "_empty"
          },
          "key": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 211,
          "end": 213,
          "length": 2
        }
      },
      "api_key": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "module": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 239,
          "end": 241,
          "length": 2
        }
      },
      "ask": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "text": {
            "value": "_empty",
            "type": "_empty"
          },
          "kwargs": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 21,
          "end": 23,
          "length": 2
        }
      },
      "desc": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "module": {
            "value": "_empty",
            "type": "_empty"
          },
          "max_age": {
            "value": 0,
            "type": "int"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 215,
          "end": 235,
          "length": 20
        }
      },
      "edit": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "args": {
            "value": "_empty",
            "type": "_empty"
          },
          "kwargs": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 236,
          "end": 238,
          "length": 2
        }
      },
      "exe": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "text": {
            "value": "_empty",
            "type": "_empty"
          },
          "path": {
            "value": "./",
            "type": "str"
          },
          "kwargs": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 36,
          "end": 51,
          "length": 15
        }
      },
      "generate": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "text": {
            "value": "whats 2+2?",
            "type": "str"
          },
          "temperature": {
            "value": 0.5,
            "type": "float"
          },
          "max_tokens": {
            "value": 1000000,
            "type": "int"
          },
          "stream": {
            "value": true,
            "type": "bool"
          },
          "process_text": {
            "value": true,
            "type": "bool"
          },
          "kwargs": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 17,
          "end": 20,
          "length": 3
        }
      },
      "models": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "args": {
            "value": "_empty",
            "type": "_empty"
          },
          "kwargs": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 177,
          "end": 179,
          "length": 2
        }
      },
      "plan": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "text": {
            "value": "_empty",
            "type": "_empty"
          },
          "extra_text": {
            "value": "_empty",
            "type": "_empty"
          },
          "path": {
            "value": "./",
            "type": "str"
          },
          "run": {
            "value": false,
            "type": "bool"
          },
          "kwargs": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 242,
          "end": 277,
          "length": 35
        }
      },
      "process_response": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "response": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 52,
          "end": 60,
          "length": 8
        }
      },
      "process_text": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "text": {
            "value": "_empty",
            "type": "_empty"
          },
          "threshold": {
            "value": 1000,
            "type": "int"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 61,
          "end": 105,
          "length": 44
        }
      },
      "reduce": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "text": {
            "value": "_empty",
            "type": "_empty"
          },
          "max_chars": {
            "value": 10000,
            "type": "int"
          },
          "timeout": {
            "value": 40,
            "type": "int"
          },
          "max_age": {
            "value": 30,
            "type": "int"
          },
          "model": {
            "value": "openai/o1-mini",
            "type": "str"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 107,
          "end": 176,
          "length": 69
        }
      },
      "resolve_path": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "path": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 206,
          "end": 208,
          "length": 2
        }
      },
      "score": {
        "input": {
          "self": {
            "value": "_empty",
            "type": "_empty"
          },
          "module": {
            "value": "_empty",
            "type": "_empty"
          },
          "kwargs": {
            "value": "_empty",
            "type": "_empty"
          }
        },
        "output": {
          "value": null,
          "type": "None"
        },
        "docs": null,
        "path": "/commune/modules/agent/agent.py",
        "filebounds": {
          "start": 181,
          "end": 205,
          "length": 24
        }
      }
    },
  };

  const moduleCodeResponse = await lighthouse.uploadText(JSON.stringify(moduleCodeData), LIGHTHOUSE_API_KEY);
  const moduleCodeHash = moduleCodeResponse.data.Hash;
  console.log("Module code uploaded. IPFS CID:", moduleCodeHash);

  const user = await prisma.user.upsert({
    where: { walletPublicKey },
    update: {},
    create: {
      walletPublicKey,
      nonce: "",
      name: "commune"
    }
  });

  const moduleRecord = await prisma.module.upsert({
    where: { name: "agent" },
    update: {},
    create: {
      name: moduleMetadata.name,
      description: moduleMetadata.description,
      network: moduleMetadata.network,
      tags: moduleMetadata.tags,
      codelocation: moduleMetadata.codelocation,
      appurl: moduleMetadata.appurl,
      ipfs_cid: moduleMetadataHash,
      userId: user.id
    }
  });

  const moduleCodeRecord = await prisma.moduleCode.create({
    data: {
      ipfs_cid: moduleCodeHash,
      moduleId: moduleRecord.id
    }
  });

  console.log("Seeding completed:", { user, moduleRecord, moduleCodeRecord });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
