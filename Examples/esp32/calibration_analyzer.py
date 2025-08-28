#!/usr/bin/env python3
"""
ESP32 Sensor Calibration Data Analyzer

This script analyzes the raw sensor data output from the ESP32 calibration file
and provides comprehensive calibration recommendations for:
- AD8232 ECG sensor
- HW-484 sound sensor (breathing detection)
- GSR sensor

Usage:
1. Run the ESP32 calibration file and copy the Serial Monitor output
2. Save the output to a text file
3. Run this script: python calibration_analyzer.py <filename>
"""

import sys
import re
import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict
import argparse
from datetime import datetime

class SensorCalibrationAnalyzer:
    def __init__(self):
        self.data = {
            'ecg': {'raw': [], 'deviation': [], 'timestamps': []},
            'gsr': {'raw': [], 'deviation': [], 'timestamps': []},
            'resp': {'raw': [], 'deviation': [], 'timestamps': []}
        }
        self.baseline_results = {}
        self.breath_analysis = {}
        self.calibration_recommendations = {}
        
    def parse_calibration_data(self, filename):
        """Parse the calibration output file and extract sensor data"""
        print(f"🔍 Parsing calibration data from: {filename}")
        
        try:
            with open(filename, 'r') as file:
                lines = file.readlines()
        except FileNotFoundError:
            print(f"❌ Error: File '{filename}' not found")
            return False
            
        # Parse different types of lines
        for line in lines:
            line = line.strip()
            
            # Parse DATA lines (continuous monitoring)
            if line.startswith('DATA:'):
                self._parse_data_line(line)
            
            # Parse breath detection lines
            elif 'BREATH IN detected!' in line or 'BREATH OUT detected!' in line:
                self._parse_breath_line(line)
            
            # Parse baseline calibration results
            elif 'Range:' in line and 'Span:' in line:
                self._parse_baseline_line(line)
                
        print(f"✅ Parsed {len(self.data['ecg']['raw'])} data points")
        return True
    
    def _parse_data_line(self, line):
        """Parse DATA lines from continuous monitoring"""
        try:
            # Format: DATA: timestamp, ecg_raw, ecg_dev, gsr_raw, gsr_dev, resp_raw, resp_dev
            parts = line.split(': ')[1].split(', ')
            timestamp = int(parts[0])
            ecg_raw = int(parts[1])
            ecg_dev = int(parts[2])
            gsr_raw = int(parts[3])
            gsr_dev = int(parts[4])
            resp_raw = int(parts[5])
            resp_dev = int(parts[6])
            
            # Store data
            self.data['ecg']['raw'].append(ecg_raw)
            self.data['ecg']['deviation'].append(ecg_dev)
            self.data['ecg']['timestamps'].append(timestamp)
            
            self.data['gsr']['raw'].append(gsr_raw)
            self.data['gsr']['deviation'].append(gsr_dev)
            self.data['gsr']['timestamps'].append(timestamp)
            
            self.data['resp']['raw'].append(resp_raw)
            self.data['resp']['deviation'].append(resp_dev)
            self.data['resp']['timestamps'].append(timestamp)
            
        except (IndexError, ValueError) as e:
            print(f"⚠️  Warning: Could not parse data line: {line[:50]}...")
    
    def _parse_breath_line(self, line):
        """Parse breath detection lines"""
        try:
            # Extract breath type and values
            if 'BREATH IN detected!' in line:
                breath_type = 'IN'
            else:
                breath_type = 'BREATH OUT detected!'
            
            # Extract raw value and deviation
            raw_match = re.search(r'Raw: (\d+)', line)
            dev_match = re.search(r'Deviation: ([+-]\d+)', line)
            
            if raw_match and dev_match:
                raw_val = int(raw_match.group(1))
                dev_val = int(dev_match.group(1))
                
                if 'breath_in' not in self.breath_analysis:
                    self.breath_analysis['breath_in'] = {'raw': [], 'deviation': []}
                if 'breath_out' not in self.breath_analysis:
                    self.breath_analysis['breath_out'] = {'raw': [], 'deviation': []}
                
                if breath_type == 'IN':
                    self.breath_analysis['breath_in']['raw'].append(raw_val)
                    self.breath_analysis['breath_in']['deviation'].append(dev_val)
                else:
                    self.breath_analysis['breath_out']['raw'].append(raw_val)
                    self.breath_analysis['breath_out']['deviation'].append(dev_val)
                    
        except Exception as e:
            print(f"⚠️  Warning: Could not parse breath line: {line[:50]}...")
    
    def _parse_baseline_line(self, line):
        """Parse baseline calibration results"""
        try:
            # Extract sensor type and values
            if 'ECG Sensor' in line:
                sensor = 'ecg'
            elif 'GSR Sensor' in line:
                sensor = 'gsr'
            elif 'Respiratory Sensor' in line:
                sensor = 'resp'
            else:
                return
            
            # Extract range values
            range_match = re.search(r'Range: (\d+) - (\d+)', line)
            span_match = re.search(r'Span: (\d+)', line)
            
            if range_match and span_match:
                min_val = int(range_match.group(1))
                max_val = int(range_match.group(2))
                span = int(span_match.group(1))
                
                if sensor not in self.baseline_results:
                    self.baseline_results[sensor] = {}
                
                self.baseline_results[sensor] = {
                    'min': min_val,
                    'max': max_val,
                    'span': span
                }
                
        except Exception as e:
            print(f"⚠️  Warning: Could not parse baseline line: {line[:50]}...")
    
    def analyze_sensor_data(self):
        """Perform comprehensive analysis of sensor data"""
        print("\n🔬 Analyzing sensor data...")
        
        for sensor_type in ['ecg', 'gsr', 'resp']:
            if not self.data[sensor_type]['raw']:
                continue
                
            raw_data = np.array(self.data[sensor_type]['raw'])
            dev_data = np.array(self.data[sensor_type]['deviation'])
            
            # Calculate statistics
            stats = {
                'mean': np.mean(raw_data),
                'std': np.std(raw_data),
                'min': np.min(raw_data),
                'max': np.max(raw_data),
                'range': np.max(raw_data) - np.min(raw_data),
                'median': np.median(raw_data),
                'q25': np.percentile(raw_data, 25),
                'q75': np.percentile(raw_data, 75),
                'iqr': np.percentile(raw_data, 75) - np.percentile(raw_data, 25)
            }
            
            # Calculate noise characteristics
            stats['noise_level'] = stats['std']
            stats['signal_to_noise'] = stats['range'] / stats['std'] if stats['std'] > 0 else 0
            
            # Store results
            if sensor_type not in self.calibration_recommendations:
                self.calibration_recommendations[sensor_type] = {}
            
            self.calibration_recommendations[sensor_type]['statistics'] = stats
            
            print(f"   {sensor_type.upper()}: Mean={stats['mean']:.1f}, Std={stats['std']:.1f}, Range={stats['range']}")
    
    def analyze_breathing_patterns(self):
        """Analyze breathing patterns from HW-484 sensor"""
        print("\n🫁 Analyzing breathing patterns...")
        
        if not self.breath_analysis:
            print("   ⚠️  No breath detection data found")
            return
        
        breath_stats = {}
        
        for breath_type in ['breath_in', 'breath_out']:
            if breath_type in self.breath_analysis and self.breath_analysis[breath_type]['raw']:
                raw_vals = np.array(self.breath_analysis[breath_type]['raw'])
                dev_vals = np.array(self.breath_analysis[breath_type]['deviation'])
                
                stats = {
                    'count': len(raw_vals),
                    'mean_raw': np.mean(raw_vals),
                    'std_raw': np.std(raw_vals),
                    'mean_deviation': np.mean(dev_vals),
                    'std_deviation': np.std(dev_vals),
                    'min_deviation': np.min(dev_vals),
                    'max_deviation': np.max(dev_vals)
                }
                
                breath_stats[breath_type] = stats
                
                print(f"   {breath_type.replace('_', ' ').title()}: {stats['count']} breaths, "
                      f"Mean Dev: {stats['mean_deviation']:+.1f}, Std: {stats['std_deviation']:.1f}")
        
        # Calculate respiratory rate if we have enough data
        if 'breath_in' in breath_stats and 'breath_out' in breath_stats:
            total_breaths = breath_stats['breath_in']['count'] + breath_stats['breath_out']['count']
            if total_breaths > 0:
                # Estimate respiratory rate (assuming 60-second analysis period)
                estimated_rr = total_breaths  # breaths per minute
                print(f"   Estimated Respiratory Rate: {estimated_rr} breaths/min")
                
                if estimated_rr < 8 or estimated_rr > 30:
                    print(f"   ⚠️  Respiratory rate outside normal range (8-30 breaths/min)")
        
        self.calibration_recommendations['breathing'] = breath_stats
    
    def generate_calibration_recommendations(self):
        """Generate comprehensive calibration recommendations"""
        print("\n🎯 Generating calibration recommendations...")
        
        recommendations = {}
        
        for sensor_type in ['ecg', 'gsr', 'resp']:
            if sensor_type not in self.calibration_recommendations:
                continue
                
            stats = self.calibration_recommendations[sensor_type]['statistics']
            
            if sensor_type == 'ecg':
                # ECG recommendations
                recommendations[sensor_type] = {
                    'peak_threshold': int(stats['range'] / 3),
                    'noise_threshold': int(stats['std'] * 2),
                    'baseline_stability': 'Good' if stats['std'] < stats['range'] / 10 else 'Poor',
                    'recommended_sampling_rate': '250Hz',
                    'filtering_needed': stats['std'] > stats['range'] / 20
                }
                
            elif sensor_type == 'gsr':
                # GSR recommendations
                recommendations[sensor_type] = {
                    'change_threshold': int(stats['range'] / 8),
                    'noise_threshold': int(stats['std'] * 1.5),
                    'baseline_stability': 'Good' if stats['std'] < stats['range'] / 15 else 'Poor',
                    'recommended_sampling_rate': '10Hz',
                    'filtering_needed': stats['std'] > stats['range'] / 30
                }
                
            elif sensor_type == 'resp':
                # Respiratory recommendations
                recommendations[sensor_type] = {
                    'breath_threshold': int(stats['range'] / 4),
                    'noise_threshold': int(stats['std'] * 2),
                    'baseline_stability': 'Good' if stats['std'] < stats['range'] / 12 else 'Poor',
                    'recommended_sampling_rate': '100Hz',
                    'filtering_needed': stats['std'] > stats['range'] / 25
                }
        
        # Breathing pattern recommendations
        if 'breathing' in self.calibration_recommendations:
            breath_stats = self.calibration_recommendations['breathing']
            
            if 'breath_in' in breath_stats and 'breath_out' in breath_stats:
                # Calculate optimal thresholds
                in_dev_mean = breath_stats['breath_in']['mean_deviation']
                out_dev_mean = breath_stats['breath_out']['mean_deviation']
                
                recommendations['breathing'] = {
                    'breath_in_threshold': int(abs(in_dev_mean) * 0.7),
                    'breath_out_threshold': int(abs(out_dev_mean) * 0.7),
                    'min_breath_interval': 1000,  # 1 second
                    'pattern_quality': 'Good' if abs(in_dev_mean - out_dev_mean) > 50 else 'Poor',
                    'recommended_algorithm': 'Threshold-based with hysteresis'
                }
        
        self.calibration_recommendations['recommendations'] = recommendations
        return recommendations
    
    def print_calibration_report(self):
        """Print comprehensive calibration report"""
        print("\n" + "="*80)
        print("📊 ESP32 SENSOR CALIBRATION REPORT")
        print("="*80)
        
        # Print sensor statistics
        for sensor_type in ['ecg', 'gsr', 'resp']:
            if sensor_type in self.calibration_recommendations:
                stats = self.calibration_recommendations[sensor_type]['statistics']
                print(f"\n🔌 {sensor_type.upper()} SENSOR ANALYSIS:")
                print(f"   Raw Range: {stats['min']} - {stats['max']} (Span: {stats['range']})")
                print(f"   Baseline: {stats['median']:.1f} (Median)")
                print(f"   Noise Level: ±{stats['std']:.1f}")
                print(f"   Signal-to-Noise Ratio: {stats['signal_to_noise']:.2f}")
        
        # Print breathing analysis
        if 'breathing' in self.calibration_recommendations:
            print(f"\n🫁 BREATHING PATTERN ANALYSIS:")
            breath_stats = self.calibration_recommendations['breathing']
            
            for breath_type in ['breath_in', 'breath_out']:
                if breath_type in breath_stats:
                    stats = breath_stats[breath_type]
                    print(f"   {breath_type.replace('_', ' ').title()}:")
                    print(f"     Count: {stats['count']}")
                    print(f"     Mean Deviation: {stats['mean_deviation']:+.1f}")
                    print(f"     Deviation Range: {stats['min_deviation']} to {stats['max_deviation']}")
        
        # Print recommendations
        if 'recommendations' in self.calibration_recommendations:
            print(f"\n🎯 CALIBRATION RECOMMENDATIONS:")
            recs = self.calibration_recommendations['recommendations']
            
            for sensor_type, rec in recs.items():
                if sensor_type == 'breathing':
                    print(f"\n   🫁 BREATHING DETECTION:")
                    print(f"     Breath IN Threshold: {rec['breath_in_threshold']}")
                    print(f"     Breath OUT Threshold: {rec['breath_out_threshold']}")
                    print(f"     Pattern Quality: {rec['pattern_quality']}")
                    print(f"     Algorithm: {rec['recommended_algorithm']}")
                else:
                    print(f"\n   🔌 {sensor_type.upper()} SENSOR:")
                    if 'peak_threshold' in rec:
                        print(f"     Peak Threshold: {rec['peak_threshold']}")
                    if 'change_threshold' in rec:
                        print(f"     Change Threshold: {rec['change_threshold']}")
                    if 'breath_threshold' in rec:
                        print(f"     Breath Threshold: {rec['breath_threshold']}")
                    print(f"     Baseline Stability: {rec['baseline_stability']}")
                    print(f"     Filtering Needed: {'Yes' if rec['filtering_needed'] else 'No'}")
                    print(f"     Recommended Sampling: {rec['recommended_sampling_rate']}")
        
        print(f"\n" + "="*80)
        print("📝 NEXT STEPS:")
        print("1. Update your ESP32 main.ino with the recommended thresholds")
        print("2. Test the new thresholds with real subjects")
        print("3. Fine-tune based on performance")
        print("4. Consider implementing adaptive thresholds for different subjects")
        print("="*80)
    
    def save_recommendations_to_file(self, filename):
        """Save calibration recommendations to a file"""
        try:
            with open(filename, 'w') as f:
                f.write("ESP32 Sensor Calibration Recommendations\n")
                f.write("Generated on: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
                
                # Write recommendations in a format suitable for ESP32 code
                f.write("// Copy these values to your ESP32 main.ino file\n\n")
                
                if 'recommendations' in self.calibration_recommendations:
                    recs = self.calibration_recommendations['recommendations']
                    
                    for sensor_type, rec in recs.items():
                        if sensor_type == 'breathing':
                            f.write(f"// Breathing Detection Thresholds\n")
                            f.write(f"const int BREATH_IN_THRESHOLD = {rec['breath_in_threshold']};\n")
                            f.write(f"const int BREATH_OUT_THRESHOLD = {rec['breath_out_threshold']};\n")
                            f.write(f"const int MIN_BREATH_INTERVAL = {rec['min_breath_interval']};\n\n")
                        else:
                            f.write(f"// {sensor_type.upper()} Sensor Thresholds\n")
                            if 'peak_threshold' in rec:
                                f.write(f"const int {sensor_type.upper()}_PEAK_THRESHOLD = {rec['peak_threshold']};\n")
                            if 'change_threshold' in rec:
                                f.write(f"const int {sensor_type.upper()}_CHANGE_THRESHOLD = {rec['change_threshold']};\n")
                            if 'breath_threshold' in rec:
                                f.write(f"const int {sensor_type.upper()}_BREATH_THRESHOLD = {rec['breath_threshold']};\n")
                            f.write("\n")
                
                f.write("// Additional Recommendations:\n")
                f.write("// - Consider implementing adaptive thresholds\n")
                f.write("// - Monitor baseline drift over time\n")
                f.write("// - Implement sensor health checks\n")
                
            print(f"✅ Recommendations saved to: {filename}")
            
        except Exception as e:
            print(f"❌ Error saving recommendations: {e}")

def main():
    parser = argparse.ArgumentParser(description='ESP32 Sensor Calibration Data Analyzer')
    parser.add_argument('filename', help='Path to the calibration data file')
    parser.add_argument('--output', '-o', help='Output file for recommendations', default='calibration_recommendations.txt')
    parser.add_argument('--plot', '-p', action='store_true', help='Generate plots of sensor data')
    
    args = parser.parse_args()
    
    # Create analyzer
    analyzer = SensorCalibrationAnalyzer()
    
    # Parse data
    if not analyzer.parse_calibration_data(args.filename):
        sys.exit(1)
    
    # Analyze data
    analyzer.analyze_sensor_data()
    analyzer.analyze_breathing_patterns()
    
    # Generate recommendations
    recommendations = analyzer.generate_calibration_recommendations()
    
    # Print report
    analyzer.print_calibration_report()
    
    # Save recommendations
    analyzer.save_recommendations_to_file(args.output)
    
    print(f"\n🎉 Analysis complete! Check '{args.output}' for ESP32 code recommendations.")

if __name__ == "__main__":
    main()
