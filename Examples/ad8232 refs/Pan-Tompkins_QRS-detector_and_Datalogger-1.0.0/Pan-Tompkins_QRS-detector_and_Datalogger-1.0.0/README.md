# Pan-Tompkins_QRS-detector_and_Datalogger

Provided is an Arduino based AD8232 Pan-Tompkins QRS-detector and Datalogger that can plot and send Serial information to Unity (Arduino_QRS-detector) at the same time as well as an Unity 3D script (Arduino_Read) that receives the data. The processed Arduino data can be also send to other programs and is not limited to Unity 3D alone. A Fritzing schematic for wiring and needed components can be found under the "Pictures" folder. Pictures of the real setup are also available there.

For more in depth details and performance, see the following paper: (Link to paper)

This script saves the Date, the Timestamp, a Timer that counts the passed time and a counter for the number of recorded data-points, if enabled. The data is automatically saved on a microSD card and shows an error, when no data can be written on the SD card. This option can be disabled, too.

The SD card saves data according to the FAT file system using the 8.3 format. That means a the filename that you choose for your data must not exceed 8 characters (e.g. the number or the initials of your participant). The file can also be stored as an .csv file.

It can be decided if tones should be played together with the QRS detection and if so, if in the same rhythym or faster or slower (percentage can be tuned) in respect to the last QRS-QRS interval. \\

This Setup proved to be fast and reliable and suitable for scientific research (For more information, see: Link to paper) and can be used according to the MIT license.

-   © Script written by Tim Möller
-   Humboldt Universität zu Berlin
-   Berlin School of Mind and Brain Berlin
-
-   This script records data from the AD8232 shield and plots the data.
-   Preprocessing and detect of the QRS compley is realized through the Pan-Tompkins algorithm
-   (Pan, J., & Tompkins, W. J. (1985). A real-time QRS detection algorithm. IEEE Trans. Biomed.
-   Eng, 32(3), 230-236.).
-   -   This script also saves the Date, the Timestamp, a Timer that counts the passed time and a
-   counter for the number of recorded data-points.
-
-   Some of the code contains element from available, open access, existing scripts and is marked sccordingly inside the code. The complete Code-snippets that were used can be found under:
-   https://github.com/adafruit/Adafruit_SSD1306
-   https://github.com/blakeMilner/real_time_QRS_detection
-   https://github.com/dxinteractive/ResponsiveAnalogRead
-   SD card read/write (Arduino example sketches) created Nov 2010 by David A. Mellis modified 9 Apr 2012 by Tom Igoe
-   This example code is in the public domain.
-   SD Card test created 28 Mar 2011 by Limor Fried modified 9 Apr 2012 by Tom Igoe
-   This example code is in the public domain.
-
-   Last modified: 25.03.2020
-

Please cite as XXX
