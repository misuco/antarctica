/**
 * Antarctica
 *
 * Piano music composition generator
 *
 * (c) 2022 by claudio zopfi
 *
 * Licence: GNU/GPL
 *
 * https://github.com/misuco/antarctica
 *
 */

#include <stdlib.h>
#include <unistd.h>
#include <cstdlib>
#include <ctime>
#include <math.h>
#include "midicalc.hpp"

Midicalc mc;
map<int, int> quarterHistogram;

inline bool file_exists (const string& name) {
    ifstream f(name.c_str());
    return f.good();
}

void createNewSong( string filename, int tempo, vector<Midicalc::BlockConfig> config, int scale, int basenote ) {
    mc.setBPM( tempo );
    mc.initScaleFilter(scale,basenote);
    mc.newMidiFile( config );
    cout << "create_file v2.4: " << filename << endl << "tempo: " << tempo << endl;
    mc.saveNewMidiFile( filename );
}

int main(int argc, char *argv[])
{

    //if(file_exists(":/data/chords.csv") ) { cout << "chords.csv exists"; } else { cout << "chords.csv does NOT exist"; }
    //if(file_exists(":/data/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid")) { cout << "_Sechs_kleine_Klavierstcke_Op exists"; } else { cout << "_Sechs_kleine_Klavierstcke_Op does NOT exist"; }

    mc.loadChordMap( "/home/antarctica/chords.csv" );
    mc.loadScaleMap( "/home/antarctica/scales_cleaned_sorted.csv" );
    //mc.loadMidiFile( ":/data/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
    //mc.loadMidiFile( "/home/c1/ownCloud/studio-exchange/schoenberg/Midi/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
    mc.loadMidiFile( "/home/antarctica/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
    mc.analyzeMidiFile();

    cout << "Params:";
    for(int i=0;i<argc;i++) {
        cout << " " << argv[i];
    }
    cout << endl;

    string target="";
    int block=0;
    int pitchBlock=0;
    int loopLength=0;
    int repeat=0;
    int tempo=0;
    int pitch=0;
    int scale=0;
    int basenote=0;
    int arrange=0;
    int sound = 1;

    int c;
    while ((c = getopt (argc, argv, "o:b:d:l:r:t:p:s:n:a:c:")) != -1) {
        switch (c)
        {
        case 'o':
            target = optarg;
            break;
        case 'b':
            block = stoi(optarg);
            break;
        case 'd':
            pitchBlock = stoi(optarg);
            break;
        case 'l':
            loopLength = stoi(optarg);
            break;
        case 'r':
            repeat = stoi(optarg);
            break;
        case 't':
            tempo = stoi(optarg);
            break;
        case 'p':
            pitch = stoi(optarg);
            break;
        case 's':
            scale = stoi(optarg);
            break;
        case 'n':
            basenote = stoi(optarg);
            break;
        case 'a':
            arrange = stoi(optarg);
            break;
        case 'c':
            sound = stoi(optarg);
            break;
        case '?':
            if (optopt == 'c')
                fprintf (stderr, "WARNING: Option -%c requires an argument.\n", optopt);
            else if (isprint (optopt))
                fprintf (stderr, "WARNING: Unknown option `-%c'.\n", optopt);
            else
                fprintf (stderr,
                         "WARNING: Unknown option character `\\x%x'.\n",
                         optopt);
            return 1;
        default:
            abort ();
        }
    }


//    cout << "block: " << block << endl << "pitchBlock: " << pitchBlock << endl << "pitch: " << pitch << endl << "tempo: " << tempo << endl << "repeat: " << repeat << endl << "loopLength: " << loopLength << endl << "scale: " << scale << endl << "basenote: " << basenote << endl << "arrange: " << arrange << endl << "sound: " << sound << endl;

//    double secondsPerQuarter = 60.0 / tempo;
//    double playTime = 0;

//    cout << "seconds_per_quarter: " << secondsPerQuarter << endl;

    srand(std::time(0));

    vector<Midicalc::BlockConfig> config;

    if( arrange == 1 ) {
        for(int r=0;r<repeat;r++) {
            for(int c=0;c<loopLength;c++) {
                int blockRhythm = rand()%81;
                int blockPitch = rand()%81;
                config.push_back( { blockRhythm, blockPitch, pitch, tempo, basenote, scale, sound } );
            }
        }
    } else {
        for(int r=0;r<repeat;r++) {
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitchBlock+c, pitch, tempo, basenote, scale, sound } );
            }
        }
    }

    createNewSong( target, tempo, config, scale, basenote );

    return 0;
}
