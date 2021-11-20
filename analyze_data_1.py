import pandas as pd
import json
from lib import utils
DATA_FOLDER = 'json_data' # DO NOT CHANGE!

df = pd.read_excel('SIEVO JUNCTION Emissions per EUR.xlsx')

result = df.loc[df['CO2eq_kg'] > 5]

result = result.to_dict('records')

utils.clean_directory(DATA_FOLDER)
utils.output_to_file(f'{DATA_FOLDER}/emissions_per_eur', 'above_5', result)
utils.output_to_file(f'{DATA_FOLDER}/emissions_per_usd', 'above_5', result)
utils.output_to_file(f'{DATA_FOLDER}/emissions_per_usd', 'below_5', result)
