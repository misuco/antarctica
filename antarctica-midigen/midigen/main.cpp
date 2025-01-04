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
#include "midigen.hpp"

Midigen mg;
map<int, int> quarterHistogram;

inline bool file_exists (const string& name) {
    ifstream f(name.c_str());
    return f.good();
}

void createNewSong( string filename, int tempo ) {
    mg.setBPM( tempo );
    mg.newMidiFile();
    cout << "create_file: " << filename << endl << "tempo: " << tempo << endl;
    mg.saveNewMidiFile( filename );
}

int main(int argc, char *argv[])
{
    string target="midigen";
    int tempo=120;
    int c;
    while ((c = getopt (argc, argv, "t:o:")) != -1) {
        switch (c)
        {
        case 'o':
            target = optarg;
            break;
        case 't':
            tempo = stoi(optarg);
            break;
        default:
            abort ();
        }
    }    createNewSong( target, tempo );
    return 0;
}
