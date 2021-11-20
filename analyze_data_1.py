import pandas as pd
import json
from lib import utils
DATA_FOLDER = 'json_data'  # DO NOT CHANGE!

SPEND_DATA_DF = pd.read_excel('SIEVO JUNCTION Spend data.xlsx')


def _get_nan_df(df):
    return df[df['ProductId'].isna()]


def analyze_nan_df(input_df):
    df = _get_nan_df(input_df)

    countries_list = df['VendorCountry'].unique()

    countries_dictionary_list = []
    for country in countries_list:
        country_df = utils.filter_df(df, 'VendorCountry', country)
        country_stats = utils.calc_statistics(
            country_df, 'SpendOriginalCurrency')

        country_data = {
            'name': country,
            'stats': country_stats
        }
        countries_dictionary_list.append(country_data)

    return countries_dictionary_list

result = analyze_nan_df(SPEND_DATA_DF)


utils.clean_directory(DATA_FOLDER)
utils.output_to_file(f'{DATA_FOLDER}/spend_data', 'analyze_nan_df', result)

def search(df,filter_criteria):
    product=filter_criteria['product']
    city=filter_criteria['location']['city']
    price_range=filter_criteria['price_range']
    sort=filter_criteria['sort']

    df_product=utils.filter_df(df,'ProductName',product)
    df_city=utils.filter_df(df_product,'VendorCity',city)
    df_price=utils.filter_by_range(df_city,price_range['upper'],price_range['lower'])
    return df_price.sort_valus(by=sort)