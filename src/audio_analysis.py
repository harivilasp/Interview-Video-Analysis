from pathlib import Path
import time
import parselmouth as pm
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn
import os

audio_Column = ['Video Name', 'Length', 'Average Band Energy', 'Avg Intensity', 'Max Intensity', 'Mean Intensity', 'Range Intensity', 'SD Intensity', 
		   'Avg Pitch', 'Max Pitch', 'Mean Pitch', 'Range Pitch', 'SD Pitch',
		   'Mean F1', 'Mean F2', 'Mean F3', 'Mean B1', 'Mean B2', 'Mean B3', 'SD F1', 'SD F2', 'SD F3', 
		   'Mean F2/F1', 'Mean F3/F1', 'SD F2/F1', 'SD F3/F1']
audio_row = []

def amplitude(sound):
	x_sample = sound.xs()
	amplitude = sound.values[:,0]

	# print('Time: ',x_sample)
	# print('Amplitude: ',amplitude)
	
	# plt.figure()
	# plt.plot(x_sample, amplitude)
	# plt.xlim([sound.xmin, sound.xmax])
	# plt.xlabel("Time [s]")
	# plt.ylabel("Amplitude")

def intensity(sound):
	intensity = sound.to_intensity()
	
	x_sample = intensity.xs()
	y_intensity = intensity.values
	# print('Time: ',x_sample)
	# print('Intensity: ',y_intensity)

	avg_intensity = intensity.get_average(intensity.end_time,intensity.start_time,'ENERGY')
	max_intensity = np.max(y_intensity)
	min_intensity = np.min(y_intensity)
	range_intensity = max_intensity - min_intensity
	sd_intensity = np.std(y_intensity)
	# print(sd_intensity)
	
	# plt.figure()
	# plt.plot(x_sample, y_intensity, linewidth=3, color='w')
	# plt.plot(x_sample, y_intensity, linewidth=1)
	# plt.grid(False)
	# plt.xlim(intensity.start_time,intensity.end_time)
	# plt.xlabel("Time [s]")
	# plt.ylabel("intensity [dB]")
	audio_row.extend([avg_intensity, max_intensity, min_intensity, range_intensity, sd_intensity])

def pitch(sound):
	pitch = sound.to_pitch()
	
	x_sample = pitch.xs()
	y_pitch = pitch.to_matrix().values
	# print('Time: ',x_sample)
	# print('Pitch: ',y_pitch)
	
	y_pitch[y_pitch == 0] = np.nan

	avg_pitch =	np.nanmean(y_pitch)
	max_pitch =	np.nanmax(y_pitch)
	min_pitch =	np.nanmin(y_pitch)
	range_pitch	= max_pitch - min_pitch
	sd_pitch = np.nanstd(y_pitch)
	# print(sd_pitch)

	# plt.figure()
	# plt.plot(x_sample, y_pitch, linewidth=3, color='w')
	# plt.plot(x_sample, y_pitc, linewidth=1)
	# plt.grid(False)
	# plt.xlim(intensity.start_time,intensity.end_time)
	# plt.xlabel("Time [s]")
	# plt.ylabel("Frequency [dB]")
	audio_row.extend([avg_pitch, max_pitch, min_pitch, range_pitch, sd_pitch])


def formant(sound):
	formant = sound.to_formant_burg(max_number_of_formants = 5)
	f1 = []
	b1 = []
	f2 = []
	b2 = []
	f3 = []
	b3 = []

	x_sample = formant.xs()
	# print(x_sample)
	
	# start_time_formant = formant.get_start_time()
	# end_time_formant = formant.get_end_time()
	# time_step_formant = formant.get_time_step()
	# print(len(np.linspace(0.027,end_time_formant,len(formant.xs()))))
	# print(len(np.arange(0.027,end_time_formant,time_step_formant)))
	# print(start_time_formant,end_time_formant,time_step_formant)
	# print('Time: ',x_sample)
	# print(formant.get_value_at_time(1,0.039513))
	# print(formant.get_value_at_time(1,0.03325792))
	# print('Pitch: ',y_formant)

	for x in x_sample:
		f1.append(formant.get_value_at_time(1,x))
		f2.append(formant.get_value_at_time(2,x))
		f3.append(formant.get_value_at_time(3,x))
		b1.append(formant.get_bandwidth_at_time(1,x))
		b2.append(formant.get_bandwidth_at_time(2,x))
		b3.append(formant.get_bandwidth_at_time(3,x))

	mean_f1 = np.mean(f1)
	mean_f2 = np.mean(f2)
	mean_f3 = np.mean(f3)

	mean_b1 = np.mean(b1)
	mean_b2 = np.mean(b2)
	mean_b3 = np.mean(b3)

	sd_f1 = np.std(f1)
	sd_f2 = np.std(f2)
	sd_f3 = np.std(f3)

	mean_f2_by_f1 = np.mean(np.array(f2)/np.array(f1))
	mean_f3_by_f1 = np.mean(np.array(f3)/np.array(f1))
	
	sd_f2_by_f1 = np.std(np.array(f2)/np.array(f1))
	sd_f3_by_f1 = np.std(np.array(f3)/np.array(f1))

	audio_row.extend([mean_f1, mean_f2, mean_f3, mean_b1, mean_b2, mean_b3, sd_f1, sd_f2, sd_f3, 
				mean_f2_by_f1, mean_f3_by_f1, sd_f2_by_f1, sd_f3_by_f1])


def spectrum(sound):
	spectrum = sound.to_spectrum()
	band_energy_spectrum = spectrum.get_band_energy()
	# print(band_energy_spectrum)
	# spectrogram = spectrum.to_spectrogram()
	# drawSpectrogram(sound)
	audio_row.append(band_energy_spectrum)

def drawSpectrogram(sound, dynamic_range=70):

	spectrogram = sound.to_spectrogram(window_length=0.05)
	X, Y = spectrogram.x_grid(), spectrogram.y_grid()
	sg_db = 10 * np.log10(spectrogram.values.T)
	plt.pcolormesh(X, Y, sg_db, vmin=sg_db.max() - dynamic_range, cmap='afmhot')
	plt.ylim([spectrogram.ymin, spectrogram.ymax])
	plt.xlabel("time [s]")
	plt.ylabel("frequency [Hz]")
	
	plt.xlim([sound.xmin, sound.xmax])




def audio_analysis():
    
    
    ## write our code for video taking
    print("starting Audio analysis")
    global audio_row
    data = []
    directory = os.fsencode(os.getcwd())
    print(directory)
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        
        if filename.endswith(".wav") or filename.endswith(".mp3"): 
            sound = pm.Sound(filename)
            print(filename)
            audio_row.append(filename)
            end_time = sound.get_total_duration()
            audio_row.append(end_time)
            amplitude(sound)
            spectrum(sound)
            intensity(sound)
            pitch(sound)
            formant(sound)
            data.append(audio_row)
            audio_row = []
            # index +=1
        
        df = pd.DataFrame(data = data, columns = audio_Column)
        df.to_csv('audioCues.csv')
        # plt.show()
        
    else:
        print("Some Process in running file")

