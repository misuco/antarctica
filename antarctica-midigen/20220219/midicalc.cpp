//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Jan 22 22:09:46 PST 2002
// Last Modified: Tue Jan 22 22:09:48 PST 2002
// Last Modified: Mon Feb  9 21:26:32 PST 2015 Updated for C++11.
// Filename:      ...sig/examples/all/midi2text.cpp
// Web Address:   http://sig.sapp.org/examples/museinfo/midi/midi2text.cpp
// Syntax:        C++; museinfo
//
// Description:   Description: Converts a MIDI file into a text based notelist.
//

#include "midicalc.hpp"
#include <QProcess>
#include <QDir>

//////////////////////////////////////////////////////////////////////////

int Midicalc::newKey(int key) {
    int octave = key/12;
    int note = key%12;

    int newnote = 0;

    switch (note) {
    case 0:
        newnote = 0;
        break;
    case 1:
        newnote = 0;
        break;
    case 2:
        newnote = 0;
        break;
    case 3:
        newnote = 0;
        break;
    case 4:
        newnote = 4;
        break;
    case 5:
        newnote = 4;
        break;
    case 6:
        newnote = 6;
        break;
    case 7:
        newnote = 6;
        break;
    case 8:
        newnote = 6;
        break;
    case 9:
        newnote = 6;
        break;
    case 10:
        newnote = 10;
        break;
    case 11:
        newnote = 10;

    }

    newnote++;

    int newkey = octave * 12 + newnote;

    return newkey;
}

void Midicalc::setBPM(int b)
{
    bpm = b;
    currentTempo = setTempo( currentTempo / bpm );
}

void Midicalc::setCluster(int c)
{
    fromBeat = clusters[c].quarterBegin;
    toBeat = clusters[c].quarterEnd;
    fromIndex = clusters[c].iBegin;
    toIndex = clusters[c].iEnd;
}

void Midicalc::setQuarter(int q)
{
    fromBeat = blocks[q].quarterBegin;
    toBeat = blocks[q].quarterEnd;
    fromIndex = blocks[q].iBegin;
    toIndex = blocks[q].iEnd;
}

void Midicalc::setRepeat(int n)
{
    repeat = n;
}

void Midicalc::setTranspose(int n)
{
    transpose = n;
}


//////////////////////////////
//
// convertMidiFileToText --
//

Midicalc::Midicalc() :
    bpm { 125 },
    outputPath { "/media/c1/3764-3838/antarctica/" }
{
    QDir d;
    d.mkdir(outputPath+"wav");
    d.mkdir(outputPath+"mid");
}

void Midicalc::loadMidiFile(const std::string &filename)
{
    midiIn.clear();
    midiIn.read( filename );
    ticksPerQuarterNote = midiIn.getTicksPerQuarterNote();
    midiIn.absoluteTicks();
    midiIn.joinTracks();
}

void Midicalc::newMidiFile( vector<BlockConfig> blockConfigs ) {

    midiOut.clear();

    vector<uchar> midievent;     // temporary storage for MIDI events
    midievent.resize(3);        // set the size of the array to 3 bytes

    midiOut.absoluteTicks();  // time information stored as absolute time
    // (will be coverted to delta time when written)
    midiOut.addTrack(1);     // Add another two tracks to the MIDI file
    //int tpq = 1920;              // default value in MIDI file is 48
    int tpq = midiIn.getTicksPerQuarterNote();

    midiOut.setTicksPerQuarterNote(tpq);

    midiOut.addEvent( 1, 0, tempoEvent );


    //int tickOffset = 0;

    //cout << "new track with tick offset " << tickOffset << "\n";
    //cout << "events from " << fromBeat  << "(i:" << fromIndex << ") to " << toBeat << "(i:" << toIndex << ")\n";

    /* loop n */

    int loopOffset = 0;
    int n=0;
    for( auto& config: blockConfigs) {

        setQuarter( config.block );
        setTranspose( config.transpose );

        int nBlocks = toBeat - fromBeat + 1;
        n++;

        //cout << "Loop " << n << " from " << fromBeat << " to " << toBeat << " nBlocks " << nBlocks << "\n";

        for(int i=fromIndex;i<=toIndex;i++) {

            int command = midiIn[0][i][0] & 0xf0;
            int originalTick = midiIn[0][i].tick;
            int translatedTick = originalTick - fromBeat * tpq;

            if ( (command == 0x90 && midiIn[0][i][2] != 0) ||
                 (command == 0x90 || command == 0x80) ) {


                //cout << " tick " << originalTick << " translated " << translatedTick;

                int key = midiIn[0][i][1];
                int newkey = key + transpose;

                for(int j=0;j<midiIn[0][i].size();j++) {
                    midievent[j] = midiIn[0][i][j];
                }
                midievent[1] = newkey;

                int destinationTick = translatedTick + loopOffset;

                //cout << " dest " << destinationTick << " \n";
                midiOut.addEvent( 1, destinationTick /*+ tickOffset*/, midievent );


                //cout << "added event at " << translatedTick + n*tpq*(toBeat-fromBeat) /*+ tickOffset*/ << "\n";
            } else if (midiIn[0][i][0] == 0xff &&
                       midiIn[0][i][1] == 0x51) {
                //cout << "unpro event at " << translatedTick + n*tpq*(toBeat-fromBeat) /*+ tickOffset*/ << " command: " << command << "\n";
            }
            loopOffset += tpq*nBlocks;
        }
        //tickOffset += ( midiOut[0][endIndicies.at(fromBeat)].tick - midiOut[0][beginIndicies.at(toBeat)].tick);
    }

    midiOut.sortTracks();         // make sure data is in correct order

}

void Midicalc::saveNewMidiFile(const string &filename)
{
    QString groupPath=QString::fromStdString(filename).left(2);

    QDir d;
    d.mkdir(outputPath+"wav/"+groupPath);
    d.mkdir(outputPath+"mid/"+groupPath);

    QString midiPath = outputPath+"mid/"+groupPath+"/"+QString::fromStdString(filename);
    QString wavPath = outputPath+"wav/"+groupPath+"/"+QString::fromStdString(filename)+ ".wav";

    midiOut.write(midiPath.toStdString());
    QProcess p;
    //p.setProgram( "../antarctica/fluidsynth-2.2.5-win10-x64/bin/fluidsynth.exe" );
    //p.setArguments( {"../antarctica/fluidsynth-2.2.5-win10-x64/sf/TimGM6mb.sf2", QString::fromStdString( filename ), "-F", QString::fromStdString( filename ).append( ".wav" ) });
    p.setProgram( "fluidsynth" );
    p.setArguments( { midiPath, "-F", wavPath });
    p.start();
    p.waitForFinished();

    cout << "saved " << filename << " " << groupPath.toStdString() <<  "\n";
}

//////////////////////////////
//
// convertMidiFileToText --
//

void Midicalc::analyzeMidiFile() {


    map<int,int> currentHarmonics;

    double offtime = 0.0;

    int beat = 0;

    int key = 0;
    int vel = 0;

    double previousQuarter=0;

    Block b;
    b.quarterBegin = 0;
    b.quarterEnd = 0;
    b.iBegin = 0;
    b.iEnd = 0;
    b.tempoInit=-1;
    b.tempoMin=9999;
    b.tempoMax=0;
    b.nNoteOn = 0;
    b.nNoteOff = 0;
    b.nEventTempo = 0;
    b.nEventOther = 0;
    b.totalOn = 0;

    Block cluster;
    cluster = b;

    for (int i=0; i<midiIn.getNumEvents(0); i++) {
        int command = midiIn[0][i][0] & 0xf0;
        int tick = midiIn[0][i].tick;
        double quarter = (double)tick / (double)ticksPerQuarterNote;

        beat = quarter / 4;

        b.iEnd = i;
        b.quarterEnd = quarter;

        cluster.iEnd = i;
        cluster.quarterEnd = quarter;

        if( (int)quarter != (int)previousQuarter ) {
            b.iEnd--;
            b.quarterEnd--;

            cluster.iEnd--;
            cluster.quarterEnd--;

            bool nNewNoteEvents = b.nNoteOn + b.nNoteOff;

            blocks.push_back(b);

            cout << "- block" << blocks.size() << "\tbeat\t" << beat << "\tquarter begin\t" << b.quarterBegin << "\tend\t" << b.quarterEnd << "\tindex begin\t" << b.iBegin << "\tend\t" << b.iEnd;
            cout << "\ton\t" << b.nNoteOn << "\toff\t" << b.nNoteOff << "\tother\t" << b.nEventOther << "\tonOffdiff\t" << b.nNoteOn - b.nNoteOff << "\tcOn\t" <<  b.totalOn << "\ttempo init\t" << b.tempoInit << "\tmin\t" << b.tempoMin << "\tmax\t" << b.tempoMax << "\tevs\t" << b.nEventTempo;

            b.quarterBegin = quarter;
            b.iBegin = i;
            //b.iEnd = 0;
            b.tempoInit=currentTempo;
            b.tempoMin=currentTempo;
            b.tempoMax=currentTempo;
            b.nNoteOn = 0;
            b.nNoteOff = 0;
            b.nEventTempo = 0;
            b.nEventOther = 0;
            b.totalOn = 0;

            harmonicAnalyze(b);
            b.notes.clear();
            b.harmonicMap.clear();

            if( cluster.totalOn == 0 && nNewNoteEvents > 0 ) {
                clusters.push_back( cluster );
                cout << "- end cluster ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n";
                cout << "- cluster " << clusters.size() << "\tbeat\t" << beat << "\tquarter begin\t" << cluster.quarterBegin << "\tend\t" << cluster.quarterEnd << "\tindex begin\t" << cluster.iBegin << "\tend\t" << cluster.iEnd;
                cout << "\ton\t" << cluster.nNoteOn << "\toff\t" << cluster.nNoteOff << "\tother\t" << cluster.nEventOther << "\tonOffdiff\t" << cluster.nNoteOn - cluster.nNoteOff << "\tcOn\t" <<  cluster.totalOn << "\ttempo init\t" << cluster.tempoInit << "\tmin\t" << cluster.tempoMin << "\tmax\t" << cluster.tempoMax << "\tevs\t" << cluster.nEventTempo;

                cluster.quarterBegin = quarter;
                cluster.iBegin = i;
                //cluster.iEnd = 0;
                cluster.tempoInit=currentTempo;
                cluster.tempoMin=currentTempo;
                cluster.tempoMax=currentTempo;
                cluster.nNoteOn = 0;
                cluster.nNoteOff = 0;
                cluster.nEventTempo = 0;
                cluster.nEventOther = 0;
                cluster.totalOn = 0;

                harmonicAnalyze(cluster);
                cluster.notes.clear();
                cluster.harmonicMap.clear();

                cout << "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n\n";

            }

        }


        if (command == 0x90 && midiIn[0][i][2] != 0) {
            // NOTE ON
            key = midiIn[0][i][1];
            vel = midiIn[0][i][2];

            currentHarmonics[key]++;
            if(currentHarmonics[key]>1) cout << "WARNING: multiple key press for " << key << "\n";

            b.harmonicMap[tick] = currentHarmonics;
            b.notes[key]++;
            b.nNoteOn++;
            b.totalOn++;

            cluster.harmonicMap[tick] = currentHarmonics;
            cluster.notes[key]++;
            cluster.nNoteOn++;
            cluster.totalOn++;

        } else if (command == 0x90 || command == 0x80) {
            // NOTE OFF
            key = midiIn[0][i][1];

            currentHarmonics[key]--;
            if(currentHarmonics[key]<0) cout << "WARNING: negative key value for " << key << "\n";
            if(currentHarmonics[key]<=0) currentHarmonics.erase(key);

            b.harmonicMap[tick] = currentHarmonics;
            b.nNoteOff++;
            b.totalOn--;

            cluster.harmonicMap[tick] = currentHarmonics;
            cluster.nNoteOff++;
            cluster.totalOn--;

        } else if (midiIn[0][i][0] == 0xff &&
                   midiIn[0][i][1] == 0x51) {
            // TEMPO
            currentTempo = getTempo(i);
            if(b.tempoInit == -1) {
                b.tempoInit = currentTempo;
                cluster.tempoInit = currentTempo;
            }

            if(currentTempo>b.tempoMax) b.tempoMax = currentTempo;
            if(currentTempo<b.tempoMin) b.tempoMin = currentTempo;
            b.nEventTempo++;

            if(currentTempo>cluster.tempoMax) cluster.tempoMax = currentTempo;
            if(currentTempo<cluster.tempoMin) cluster.tempoMin = currentTempo;
            cluster.nEventTempo++;

        } else {
            b.nEventOther++;
            cluster.nEventOther++;
        }

        previousQuarter = quarter;
    }
}

void Midicalc::harmonicAnalyze(Block b) {
    int min = 999;
    int max = 0;
    int sum = 0;

    for(auto& item:b.notes) {
        //cout << item.first << "\t(" << item.second << ")\t";
        int note = item.first;
        int count = item.second;

        if(note<min) min=note;
        if(note>max) max=note;

        sum+=count;
    }

    cout << "\tnotes\t" << sum << "\tmin\t" << min << "\tmax\t" << max << "\tharmonies\t" << b.harmonicMap.size();

    for(auto& harmony:b.harmonicMap) {
        int prevNote = -1;
        cout << " | ";

        auto& notes = harmony.second;
        vector<int> tripletSteps;
        vector<int> triplets;

        for(auto& note:notes) {
            int currNote = note.first;
            triplets.push_back( currNote );
            if(triplets.size()>3) triplets.erase(triplets.begin());

            if(prevNote>=0) {
                int step = currNote - prevNote;
                tripletSteps.push_back( step );
                if(tripletSteps.size()>2) tripletSteps.erase(tripletSteps.begin());
                if(tripletSteps.size() == 2) {
                    cout << triplet2txt( tripletSteps, triplets ) << " ";
                }

                //cout << ">" << step2txt(step) << "> ";
            }
            //cout << midinote2txt( currNote ) << " ";
            prevNote = currNote;
        }
    }
    cout << "\n";
}

string Midicalc::triplet2txt(vector<int> tripletSteps, vector<int> triplets) {
    std::string txt="";
    if( tripletSteps[0] == 4 && tripletSteps[1] == 3) {
        txt=midinote2txt( triplets[0] ) + " DUR";
    }
    if( tripletSteps[0] == 3 && tripletSteps[1] == 5) {
        txt=midinote2txt( triplets[1] ) + " DUR-1";
    }
    if( tripletSteps[0] == 5 && tripletSteps[1] == 4) {
        txt=midinote2txt( triplets[2] ) + " DUR-2";
    }
    if( tripletSteps[0] == 3 && tripletSteps[1] == 4) {
        txt=midinote2txt( triplets[0] ) + " MOL";
    }
    if( tripletSteps[0] == 5 && tripletSteps[1] == 3) {
        txt=midinote2txt( triplets[2] ) + "MOL-2";
    }
    return txt;
}

string Midicalc::step2txt(int step) {
    std::string txt = std::to_string( step );
    switch (step) {
    case 2:
        txt="SUS2";
        break;
    case 3:
        txt="MOLL";
        break;
    case 4:
        txt="DUR";
        break;
    case 5:
        txt="SUS4";
        break;
    case 6:
        txt="DIM";
        break;
    case 7:
        txt="QUINTE";
        break;
    case 8:
        txt="AUG";
        break;
    }
    return txt;
}

string Midicalc::midinote2txt(int note) {
    int octave=note/12;
    int v=note%12;
    std::string txt = "?";

    switch (v) {
    case 0:
        txt="C";
        break;
    case 1:
        txt="C#";
        break;
    case 2:
        txt="D";
        break;
    case 3:
        txt="D#";
        break;
    case 4:
        txt="E";
        break;
    case 5:
        txt="F";
        break;
    case 6:
        txt="F#";
        break;
    case 7:
        txt="G";
        break;
    case 8:
        txt="G#";
        break;
    case 9:
        txt="A";
        break;
    case 10:
        txt="A#";
        break;
    case 11:
        txt="B";
        break;
    }
    return txt + std::to_string( octave );

}

//////////////////////////////
//
// getTempo -- set the current tempo
//

double Midicalc::getTempo(int index) {

    MidiEvent& mididata = midiIn[0][index];

    int microseconds = 0;
    microseconds = microseconds | (mididata[3] << 16);
    microseconds = microseconds | (mididata[4] << 8);
    microseconds = microseconds | (mididata[5] << 0);

    double tempo = 60.0 / microseconds * 1000000.0;

    //cout << "Tempo " << tempo;
    tempoEvent = mididata;

    return tempo;
}

//////////////////////////////
//
// getTempo -- set the current tempo
//

double Midicalc::setTempo(double factor) {

    int microseconds = 0;
    microseconds = microseconds | (tempoEvent[3] << 16);
    microseconds = microseconds | (tempoEvent[4] << 8);
    microseconds = microseconds | (tempoEvent[5] << 0);

    double newMicroseconds = (double)microseconds * factor;
    microseconds = (int)newMicroseconds;

    tempoEvent[3] = 0x0000ff & ( microseconds >> 16 );
    tempoEvent[4] = 0x0000ff & ( microseconds >> 8 );
    tempoEvent[5] = 0x0000ff & microseconds ;

    double newtempo = 60.0 / microseconds * 1000000.0;

    cout << "changed Tempo to " << newtempo << "\n";
    return newtempo;

}
