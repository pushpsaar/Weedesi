from pathlib import Path
path = Path('node_modules/@supabase/postgrest-js/dist/index.d.mts')
text = path.read_text(encoding='utf-8')
keys = ['class PostgrestClient', 'from<TableName', 'from<ViewName', 'type PostgrestQueryBuilder', 'class PostgrestQueryBuilder', 'upsert(', 'insert(', 'update(', 'select(', 'GenericSchema', 'GenericTable', 'GenericRelationship']
for key in keys:
    idx = text.find(key)
    print(f'=== {key} === {idx}')
    if idx != -1:
        start = max(0, idx-150)
        end = min(len(text), idx+400)
        snippet = text[start:end]
        print(snippet)
        print('---\n')
