/**
 * Midigen
 *
 * Midi music generator
 *
 * (c) 2025 by claudio zopfi
 *
 * Licence: GNU/GPL
 *
 * https://github.com/misuco/antarctica
 *
 */

#ifndef MIDIGEN_HPP
#define MIDIGEN_HPP

#include "MidiFile.h"
#include "Options.h"

#include <map>
#include <ctype.h>
#include <string.h>
#include <stdio.h>
#include <iostream>
#include <vector>

using namespace std;
using namespace smf;

class Midigen {

public:

    Midigen();
    ~Midigen() {}

    void    setBPM(int b );
    void    newMidiFile ();
    void    saveNewMidiFile(const string &filename);

private:
    MidiFile    midiOut;
    MidiFile    midiOutLoop;
    int         ticksPerQuarterNote;

    // parameters
    int bpm;

    // control
    MidiEvent tempoEvent;
    double  currentTempo = 60.0;

    // function declarations:
    //double  getTempo(int index);
    int     filterKey(int key);
    void setTempo(double factor);

    string outputPath;
};

#endif // MIDIGEN_HPP
