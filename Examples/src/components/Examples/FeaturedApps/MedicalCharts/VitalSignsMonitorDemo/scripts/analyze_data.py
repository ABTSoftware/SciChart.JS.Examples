import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def generate_visuals():
    df = pd.read_csv('comprehensive_biofeedback_dataset.csv')
    sns.set_theme(style="whitegrid")
    
    # 1. Representative Time-Series (Subject S01)
    plt.figure(figsize=(12, 6))
    s01 = df[df['subject_id'] == 'S01'].sort_values('timestamp').reset_index()
    s01['Time_Mins'] = s01.index * 0.5

    fig, ax1 = plt.subplots(figsize=(12, 6))
    ax2 = ax1.twinx()
    ax3 = ax1.twinx()
    ax3.spines['right'].set_position(('outward', 60))

    p1, = ax1.plot(s01['Time_Mins'], s01['heart_rate'], color='#d62728', label='Heart Rate (BPM)', linewidth=2.5)
    p2, = ax2.plot(s01['Time_Mins'], s01['respiratory_rate'], color='#1f77b4', label='Respiratory Rate (BPM)', linewidth=2.5)
    p3, = ax3.plot(s01['Time_Mins'], s01['gsr_value'], color='#2ca02c', label='Galvanic Skin Response (µS)', linewidth=2.5)

    ax1.set_xlim(0, 20)
    ax1.set_xlabel('Session Time (Minutes)', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Heart Rate (BPM)', color='#d62728', fontsize=12, fontweight='bold')
    ax2.set_ylabel('Respiratory Rate (BPM)', color='#1f77b4', fontsize=12, fontweight='bold')
    ax3.set_ylabel('GSR (µS)', color='#2ca02c', fontsize=12, fontweight='bold')

    lines = [p1, p2, p3]
    ax1.legend(lines, [l.get_label() for l in lines], loc='upper center', bbox_to_anchor=(0.5, -0.15), ncol=3, fontsize=11)

    plt.title('Multi-modal Physiological Convergence across 20-min Session', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig('fig1_convergence.png', dpi=300, bbox_inches='tight')
    plt.close()

    # 2. HRV Metrics Boxplots
    plt.figure(figsize=(10, 6))
    phase_map = {'P1': 'Phase I: Baseline', 'P2': 'Phase II: Biofeedback', 'P3': 'Phase III: Recovery'}
    df['Phase_Name'] = df['phase'].map(phase_map)
    
    # We use a custom legend to ensure colors match perfectly without seaborn warnings
    ax = sns.boxplot(x='Phase_Name', y='hrv_rmssd', data=df, palette=['#ff9999', '#66b3ff', '#99ff99'])
    plt.title('HRV-RMSSD Enhancement across Study Phases (N=30)', fontsize=14, fontweight='bold')
    plt.ylabel('RMSSD (milliseconds)', fontsize=12, fontweight='bold')
    plt.xlabel('Study Phase', fontsize=12, fontweight='bold')
    
    import matplotlib.patches as mpatches
    colors = ['#ff9999', '#66b3ff', '#99ff99']
    labels = ['Baseline', 'Biofeedback', 'Recovery']
    patches_list = [mpatches.Patch(color=colors[i], label=labels[i]) for i in range(len(labels))]
    plt.legend(handles=patches_list, title='Phase', loc='upper right')
    
    plt.tight_layout()
    plt.savefig('fig2_hrv_shift.png', dpi=300, bbox_inches='tight')
    plt.close()

    # 3. RSA Magnitude vs Respiratory Rate
    plt.figure(figsize=(10, 6))
    p2_data = df[df['phase'] == 'P2'].copy()
    sns.regplot(x='respiratory_rate', y='resp_rsa', data=p2_data, 
                scatter_kws={'alpha':0.6, 'color': '#9467bd', 's': 50, 'label':'Subject Data Points'}, 
                line_kws={'color':'#d62728', 'label': 'Linear Regression Trend'})
    plt.title('RSA Magnitude Correlation with Respiratory Frequency', fontsize=14, fontweight='bold')
    plt.xlabel('Respiratory Rate (Breaths Per Minute)', fontsize=12, fontweight='bold')
    plt.ylabel('RSA Magnitude (BPM Delta)', fontsize=12, fontweight='bold')
    plt.legend(loc='upper right')
    plt.tight_layout()
    plt.savefig('fig3_rsa_correlation.png', dpi=300, bbox_inches='tight')
    plt.close()

    # 4. Group Comparison
    plt.figure(figsize=(10, 6))
    sns.barplot(x='subject_type', y='hrv_stress_index', hue='Phase_Name', data=df, palette='viridis')
    plt.title('Stress Index Reduction by Cohort and Phase', fontsize=14, fontweight='bold')
    plt.ylabel('Baevsky Stress Index', fontsize=12, fontweight='bold')
    plt.xlabel('Subject Profile Classification', fontsize=12, fontweight='bold')
    # Shifted legend to the left
    plt.legend(title='Study Phase', loc='upper left')
    plt.tight_layout()
    plt.savefig('fig4_group_stress.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == "__main__":
    generate_visuals()
