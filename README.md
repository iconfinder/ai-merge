# About

This script is a JSX (JavaScript Extension) script for Adobe Illustrator to merge a folder of SVG, AI, PDF, and/or EPS files into a single Illustrator document. The script creates a new artboard named according to the file name (minus the file extension), places the file contents, centers the object, and aligns to the nearest pixel.

# CREDITS

TODO: I need to look up the original source. Please bear with me while I locate this information.

There may have been other scripts that inspired or were used in the creation of this script. Any omissions of credits are purely accidental. If you recognize an omission, please let me know and I will happily add credit where it is due.

You are free to use, modify, and distribute this script as you see fit. No credit is required but would be greatly appreciated. 

# DISCLAIMER OF LIABILITY

THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND. YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.

# INSTRUCTIONS

## BEFORE YOU START

This script has only been tested on Adobe Illustrator CC 2014. It was written to complete a one-off personal project. If you find it useful, fantastic. But I cannot verify whether or not it will work on every system.

## SETUP
 
 1. Place this script in Applications/Adobe Illustrator CC 2018/Presets/en_US/Scripts/
 
    **NOTE**
    
    _If you are not using the US English translation of Adobe Illustrator, 
    the `en\_US` folder will match that of your translation._
    
    _Also, the Adobe Illustrator folder may have a different name depending on which 
    version of Illustrator you have installed._
 
 2. Restart Adobe Illustrator to activate the script
 
 3. The script will be available under menu `File > Scripts > Ai Merge`.
 
 4. Enter values in the dialog for Artboard Width, Artboard Height, Artboard Spacing
 
 5. Choose the folder of SVG, AI, PDF, and/or EPS files. Nested folders are fine. The script will search through any nested folers for any files matching the specified file types.
    
 6. When the script runs, you will be asked to select a source folder of files you want to merge. The script will ignore any files that do not match the selected types.
    
 6. The script will create a new Adobe Illustrator document with an artboard for each file. Please note that Adobe Illustrator allows up to 1,000 artboards so the script will only work on the first 1,000 files it finds.
  
 9. If logging is enabled (in the startup dialog) the script will create a log file named `ai-script-log.txt` on the Desktop of your computer. To turn this off, set the variable named `logging` to `false` near the top of the script.