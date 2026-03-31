import pandas as pd
import os

class CarbonCalculator:
    """
    Carbon Footprint Calculator
    Calculates CO2 emissions based on user inputs
    """
    
    def __init__(self):
        # Load emission factors from CSV
        data_path = os.path.join('data', 'carbon_data.csv')
        self.emission_data = pd.read_csv(data_path)
        
    def calculate_transport(self, mode, distance_per_day):
        """
        Calculate yearly transport emissions
        
        Args:
            mode: Transport mode (car_petrol, bus, etc.)
            distance_per_day: Daily distance in km
            
        Returns:
            CO2 in tons per year
        """
        # Get emission factor for this mode
        emission_factor = self.emission_data[
            (self.emission_data['category'] == 'transport') & 
            (self.emission_data['item'] == mode)
        ]['co2_per_unit'].values[0]
        
        # Calculate yearly emissions
        daily_co2 = distance_per_day * emission_factor  # kg per day
        yearly_co2 = daily_co2 * 365  # kg per year
        
        return yearly_co2 / 1000  # Convert to tons
    
    def calculate_electricity(self, units_per_month, energy_source):
        """
        Calculate yearly electricity emissions
        
        Args:
            units_per_month: Monthly electricity consumption in kWh
            energy_source: Type of energy (coal, solar, etc.)
            
        Returns:
            CO2 in tons per year
        """
        emission_factor = self.emission_data[
            (self.emission_data['category'] == 'electricity') & 
            (self.emission_data['item'] == energy_source)
        ]['co2_per_unit'].values[0]
        
        yearly_units = units_per_month * 12
        yearly_co2 = yearly_units * emission_factor  # kg per year
        
        return yearly_co2 / 1000  # Convert to tons
    
    def calculate_diet(self, diet_type):
        """
        Calculate yearly diet emissions
        
        Args:
            diet_type: Type of diet (heavy_meat, vegetarian, vegan, etc.)
            
        Returns:
            CO2 in tons per year
        """
        emission = self.emission_data[
            (self.emission_data['category'] == 'diet') & 
            (self.emission_data['item'] == diet_type)
        ]['co2_per_unit'].values[0]
        
        return emission  # Already in tons per year
    
    def calculate_flights(self, domestic_flights, international_flights, avg_distance_domestic=1000, avg_distance_international=5000):
        """
        Calculate yearly flight emissions
        
        Args:
            domestic_flights: Number of domestic flights per year
            international_flights: Number of international flights per year
            avg_distance_domestic: Average domestic flight distance (km)
            avg_distance_international: Average international flight distance (km)
            
        Returns:
            CO2 in tons per year
        """
        # Domestic flights
        domestic_factor = self.emission_data[
            (self.emission_data['category'] == 'transport') & 
            (self.emission_data['item'] == 'flight_domestic')
        ]['co2_per_unit'].values[0]
        
        # International flights
        international_factor = self.emission_data[
            (self.emission_data['category'] == 'transport') & 
            (self.emission_data['item'] == 'flight_international')
        ]['co2_per_unit'].values[0]
        
        domestic_co2 = domestic_flights * avg_distance_domestic * domestic_factor
        international_co2 = international_flights * avg_distance_international * international_factor
        
        total_co2 = domestic_co2 + international_co2  # kg per year
        
        return total_co2 / 1000  # Convert to tons
    
    def calculate_total(self, transport_co2, electricity_co2, diet_co2, flights_co2):
        """
        Calculate total carbon footprint
        
        Returns:
            Total CO2 in tons per year
        """
        return transport_co2 + electricity_co2 + diet_co2 + flights_co2
    
    def get_breakdown(self, transport_co2, electricity_co2, diet_co2, flights_co2):
        """
        Get percentage breakdown of emissions
        
        Returns:
            Dictionary with percentages
        """
        total = self.calculate_total(transport_co2, electricity_co2, diet_co2, flights_co2)
        
        if total == 0:
            return {
                'transport': 0,
                'electricity': 0,
                'diet': 0,
                'flights': 0
            }
        
        return {
            'transport': round((transport_co2 / total) * 100, 1),
            'electricity': round((electricity_co2 / total) * 100, 1),
            'diet': round((diet_co2 / total) * 100, 1),
            'flights': round((flights_co2 / total) * 100, 1)
        }
    
    def calculate_sustainability_score(self, total_co2):
        """
        Calculate sustainability score (0-1000)
        Based on carbon footprint
        
        Average global footprint: 4 tons/year
        Target footprint: 2 tons/year (Paris Agreement goal)
        
        Score calculation:
        - 0 tons = 1000 points
        - 2 tons = 800 points (excellent)
        - 4 tons = 500 points (average)
        - 8+ tons = 200 points (poor)
        """
        if total_co2 <= 0:
            return 1000
        elif total_co2 <= 2:
            # Linear scale from 800 to 1000
            return int(800 + (1000 - 800) * (2 - total_co2) / 2)
        elif total_co2 <= 4:
            # Linear scale from 500 to 800
            return int(500 + (800 - 500) * (4 - total_co2) / 2)
        elif total_co2 <= 8:
            # Linear scale from 200 to 500
            return int(200 + (500 - 200) * (8 - total_co2) / 4)
        else:
            # Below 200, decreases slowly
            return max(50, int(200 - (total_co2 - 8) * 10))
    
    def get_score_level(self, score):
        """
        Get score level name and color
        
        Returns:
            Dictionary with level, color, emoji
        """
        if score >= 900:
            return {'level': 'Eco Champion', 'color': '#00ff00', 'emoji': '🌟'}
        elif score >= 800:
            return {'level': 'Eco Warrior', 'color': '#7fff00', 'emoji': '🌱'}
        elif score >= 650:
            return {'level': 'Eco Conscious', 'color': '#90ee90', 'emoji': '♻️'}
        elif score >= 500:
            return {'level': 'Average', 'color': '#ffa500', 'emoji': '🌍'}
        elif score >= 350:
            return {'level': 'Needs Improvement', 'color': '#ff8c00', 'emoji': '⚠️'}
        else:
            return {'level': 'High Impact', 'color': '#ff4500', 'emoji': '🔴'}