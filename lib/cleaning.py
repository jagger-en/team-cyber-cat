import re
from lib import geo_data
from lib import utils


def clean_coords(coords):
    cleaned = re.findall(r'\d+.\d+', coords)
    return {'lat': cleaned[0], 'long': cleaned[1]}


def clean_geo_data(input_geo_data):
    data_geo_cleaned = []
    for country in input_geo_data:
        cities_cleaned = []
        for city in country['cities']:
            cities_cleaned.append({
                'full_name': city.get('full_name'),
                'code_name': city.get('code_name'),
                'coords': clean_coords(city.get('coords')),
            })

        data_geo_cleaned.append({
            'full_name': country.get('full_name'),
            'code_name': country.get('code_name'),
            'coords': clean_coords(country.get('coords')),
            'cities': cities_cleaned
        })
    return data_geo_cleaned


def combine(geo_data, input_df):
    def _calc_unit_price(total_price, quantity):
        '''
        NOTE: The column SpendEUR needs to be used as the total_price! Other countries may have different currencies.
        '''
        if quantity == 'NULL':
            quantity = 1
        return total_price / quantity

    input_dict_list = utils.convert_df_to_dict(input_df)
    combined_list = []
    for input_dict in input_dict_list:
        geo_item = [item for item in geo_data if item['code_name']
                    == input_dict['VendorCountry']][0]
        city_item = [item for item in geo_item['cities']
                     if item['code_name'] == input_dict['VendorCity']][0]
        combined_list.append({
            **input_dict,
            'unit_price': _calc_unit_price(input_dict['SpendEUR'], input_dict['Quantity']),
            'country_lat': geo_item['coords']['lat'],
            'country_long': geo_item['coords']['long'],
            'city_lat': city_item['coords']['lat'],
            'city_long': city_item['coords']['long']
        })

    return utils.convert_dict_to_df(combined_list)

def add_co2_emission(co2_data,combine_df,emission_euro_df):
    def _generate_co2_eq(index_list):
        res=0
        for i in index_list:
            res+=emission_euro_df.iloc[i-1]['CO2eq_kg']
        return res/len(index_list)
    input_dict_list=utils.convert_df_to_dict(combine_df)
    for i in range(len(input_dict_list)):
        cur_dict=input_dict_list[i]
        activity_ids=co2_data.get(cur_dict['ProductName'])
        if not activity_ids is None:
            cur_dict['co2_emission']=cur_dict['unit_price']*_generate_co2_eq(activity_ids)
    return utils.convert_dict_to_df(input_dict_list)

def remove_identifier(input_df, column_name):
    def _merge_str(str_list):
        res = ''
        for i in str_list:
            res += i + ' ' if i !='/' and i!='//' else ''
        return res[:-1]
    input_dict_list = utils.convert_df_to_dict(input_df)
    for i in range(len(input_dict_list)):
        input_dict = input_dict_list[i]
        input_dict[column_name] = _merge_str(
            input_dict[column_name].split(' ')[:-1])
    return utils.convert_dict_to_df(input_dict_list)

