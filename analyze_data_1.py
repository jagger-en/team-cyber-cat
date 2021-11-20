import pandas as pd
import json
from lib import utils
DATA_FOLDER = 'json_data'  # DO NOT CHANGE!

df = pd.read_excel('SIEVO JUNCTION Spend data.xlsx')
df = df[df['ProductId'].isna()]
df_germany = df[df['VendorCountry'] == 'DE']
print(df_germany.columns)


# TODO: Later export
# utils.clean_directory(DATA_FOLDER)
# utils.output_to_file(f'{DATA_FOLDER}/emissions_per_eur', 'above_5', result)



def calc_statistics(df, numeric_column_name):
    numeric_column = df[numeric_column_name]
    max = numeric_column.max()
    min = numeric_column.min()
    mean = numeric_column.mean()
    res = {'max': max, 'min': min, 'mean': mean}
    return res


stats_germany = calc_statistics(df_germany, 'SpendOriginalCurrency')
print(stats_germany)