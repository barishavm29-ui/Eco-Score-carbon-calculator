from flask import Flask, render_template, request, jsonify
from utils.calculator import CarbonCalculator
import json

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'ecoscore-secret-key-2024'

# Initialize calculator
calculator = CarbonCalculator()


# ========== ROUTES ==========

@app.route('/')
def index():
    """
    Homepage route
    Shows landing page with project intro
    """
    return render_template('index.html')


@app.route('/calculator')
def calculator_page():
    """
    Calculator page route
    Shows the carbon footprint calculator form
    """
    return render_template('calculator.html')


@app.route('/calculate', methods=['POST'])
def calculate():
    """
    API endpoint to calculate carbon footprint
    Receives form data, processes it, returns results
    """
    try:
        # Get data from form
        data = request.get_json()
        
        # Transport calculation
        transport_mode = data.get('transport_mode', 'bus')
        transport_distance = float(data.get('transport_distance', 0))
        transport_co2 = calculator.calculate_transport(transport_mode, transport_distance)
        
        # Electricity calculation
        electricity_units = float(data.get('electricity_units', 0))
        electricity_source = data.get('electricity_source', 'coal')
        electricity_co2 = calculator.calculate_electricity(electricity_units, electricity_source)
        
        # Diet calculation
        diet_type = data.get('diet_type', 'medium_meat')
        diet_co2 = calculator.calculate_diet(diet_type)
        
        # Flight calculation
        domestic_flights = int(data.get('domestic_flights', 0))
        international_flights = int(data.get('international_flights', 0))
        flights_co2 = calculator.calculate_flights(domestic_flights, international_flights)
        
        # Total calculation
        total_co2 = calculator.calculate_total(transport_co2, electricity_co2, diet_co2, flights_co2)
        
        # Breakdown
        breakdown = calculator.get_breakdown(transport_co2, electricity_co2, diet_co2, flights_co2)
        
        # Sustainability score
        score = calculator.calculate_sustainability_score(total_co2)
        score_info = calculator.get_score_level(score)
        
        # Prepare response
        result = {
            'success': True,
            'total_co2': round(total_co2, 2),
            'breakdown': {
                'transport': round(transport_co2, 2),
                'electricity': round(electricity_co2, 2),
                'diet': round(diet_co2, 2),
                'flights': round(flights_co2, 2)
            },
            'breakdown_percentage': breakdown,
            'score': score,
            'score_level': score_info['level'],
            'score_color': score_info['color'],
            'score_emoji': score_info['emoji'],
            'comparisons': {
                'india_avg': 1.9,
                'world_avg': 4.0,
                'paris_target': 2.0
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@app.route('/dashboard')
def dashboard():
    """
    Dashboard page route
    Shows results and analytics
    """
    return render_template('dashboard.html')


@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    """
    API endpoint to get personalized recommendations
    Based on user's carbon footprint
    """
    try:
        data = request.get_json()
        total_co2 = float(data.get('total_co2', 0))
        breakdown = data.get('breakdown', {})
        
        recommendations = []
        
        # Transport recommendations
        if breakdown.get('transport', 0) > 30:
            recommendations.append({
                'category': 'Transport',
                'icon': '🚗',
                'tip': 'Use public transport 3 days/week',
                'impact': 'Save 0.8 tons CO2/year',
                'difficulty': 'Medium'
            })
            recommendations.append({
                'category': 'Transport',
                'icon': '🚴',
                'tip': 'Cycle or walk for short distances (<5km)',
                'impact': 'Save 0.5 tons CO2/year',
                'difficulty': 'Easy'
            })
        
        # Electricity recommendations
        if breakdown.get('electricity', 0) > 30:
            recommendations.append({
                'category': 'Electricity',
                'icon': '💡',
                'tip': 'Switch to LED bulbs in all rooms',
                'impact': 'Save 0.3 tons CO2/year',
                'difficulty': 'Easy'
            })
            recommendations.append({
                'category': 'Electricity',
                'icon': '☀️',
                'tip': 'Consider installing solar panels',
                'impact': 'Save 2.0 tons CO2/year',
                'difficulty': 'Hard'
            })
        
        # Diet recommendations
        if breakdown.get('diet', 0) > 25:
            recommendations.append({
                'category': 'Diet',
                'icon': '🥗',
                'tip': 'Have 2 meat-free days per week',
                'impact': 'Save 0.4 tons CO2/year',
                'difficulty': 'Medium'
            })
            recommendations.append({
                'category': 'Diet',
                'icon': '🌱',
                'tip': 'Buy local and seasonal produce',
                'impact': 'Save 0.2 tons CO2/year',
                'difficulty': 'Easy'
            })
        
        # Flight recommendations
        if breakdown.get('flights', 0) > 20:
            recommendations.append({
                'category': 'Flights',
                'icon': '✈️',
                'tip': 'Offset flight emissions through tree planting',
                'impact': 'Carbon neutral flights',
                'difficulty': 'Easy'
            })
            recommendations.append({
                'category': 'Flights',
                'icon': '🚄',
                'tip': 'Choose train over flights for short distances',
                'impact': 'Save 0.6 tons CO2/year',
                'difficulty': 'Medium'
            })
        
        # General recommendations
        recommendations.append({
            'category': 'General',
            'icon': '♻️',
            'tip': 'Recycle and compost household waste',
            'impact': 'Save 0.3 tons CO2/year',
            'difficulty': 'Easy'
        })
        
        return jsonify({
            'success': True,
            'recommendations': recommendations[:6]  # Return top 6
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


# ========== RUN APP ==========

if __name__ == '__main__':
    print("🌍 EcoScore Server Starting...")
    print("📊 Carbon Footprint Calculator Ready!")
    print("🚀 Open browser: http://localhost:5000")
    print("-" * 50)
    app.run(debug=True, port=5000)