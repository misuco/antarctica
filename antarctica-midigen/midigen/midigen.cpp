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

#include "midigen.hpp"
#include <sstream>
#include <stdlib.h>

void Midigen::setBPM(int b)
{
    if(b==0) b=1;
    bpm = b;
    setTempo( bpm );
}

//////////////////////////////
//
// convertMidiFileToText --
//

Midigen::Midigen() :
    bpm { 125 },
    outputPath { "." }
{
    //QDir d;
    //d.mkdir(outputPath+"wav");
    //d.mkdir(outputPath+"mid");
}

void Midigen::newMidiFile() {

    midiOut.clear();

    vector<uchar> midievent;     // temporary storage for MIDI events
    midievent.resize(3);         // set the size of the array to 3 bytes

    midiOut.absoluteTicks();     // time information stored as absolute time
    // (will be coverted to delta time when written)
    midiOut.addTrack(2);         // Add another two tracks to the MIDI file
    int tpq = 48;            // default value in MIDI file is 48
    //int tpq = midiIn.getTicksPerQuarterNote();
    midiOut.setTicksPerQuarterNote(tpq);

    tempoEvent.tick = 0;
    midiOut.addEvent( 1, 0, tempoEvent );

    // Drum Track

    for(int i=192;i<192+16;i++) {
        MidiEvent pc( i, 41 );
        midiOut.addEvent( 0, 0, pc );
    }

    for(int i=0;i<16;i++) {

        int tick=i*tpq/4;
        MidiEvent midievent;

        int beat=i%8;

        for(int note:{0x2A,0x24,0x26}) {
            bool addEvent=false;
            if(note==0x2A) { // HiHat
                addEvent=true;
            } else if(note==0x24) { // Bassdrum
                if(beat==0 || beat==4) {
                    addEvent=true;
                }
            } else if(note==0x26) { // Snare
                if(beat==4) {
                    addEvent=true;
                }
            }
            if(addEvent) {
                midievent.setCommand(0x99,note,0xff);
                midiOut.addEvent( 0, tick, midievent );

                midievent.setCommand(0x89,note,0x00);
                midiOut.addEvent( 0, tick+tpq/2, midievent );
            }
        }
    }


    // Bass Track

    MidiEvent pc( 192, 38 );
    midiOut.addEvent( 1, 0, pc );
    for(int i=0;i<16;i++) {

        int tick=i*tpq/4;
        MidiEvent midievent;

        int beat=i%8;

        if(beat==2 || beat==6 || beat==3 || beat==7) {
            int note=0x25;
            midievent.setCommand(0x90,note,0xff);
            midiOut.addEvent( 1, tick, midievent );

            midievent.setCommand(0x80,note,0x00);
            midiOut.addEvent( 1, tick+tpq, midievent );
        }
    }

    // End Of Track
    int endtick=4*tpq;
    midiOut.addMetaEvent( 0, endtick, 0x2F, "" );

    midiOut.addCopyright( 0, 0, "c1audio 2025" );
    midiOut.sortTracks();

    midiOutLoop = midiOut;

    /*
    // fade out 10s
    double secPerQuarter = 60.0 / tempoEvent.getTempoBPM();
    double nQuarters = 10 / secPerQuarter;
    int totalTicks = nQuarters * tpq;
    int stepTicks = totalTicks / 60;

    for(int i=120;i>=0;i-=2) {
        loopOffset += stepTicks;
        midievent[0] = 0xB0;
        midievent[1] = 0x07;
        midievent[2] = i;
        midiOut.addEvent( 1, loopOffset, midievent );
    }
    */
}

void Midigen::saveNewMidiFile(const string &filename)
{
    /*
    QString groupPath=QString::fromStdString(filename).left(2);

    QDir d;
    d.mkdir(outputPath+"wav/"+groupPath);
    d.mkdir(outputPath+"mid/"+groupPath);

    QString midiPath = outputPath+"mid/"+groupPath+"/"+QString::fromStdString(filename);
    QString wavPath = outputPath+"wav/"+groupPath+"/"+QString::fromStdString(filename)+ ".wav";
    */

    midiOut.write(filename+".mid");
    midiOutLoop.write(filename+"-loop.mid");

    /*
    QProcess p;
    //p.setProgram( "../antarctica/fluidsynth-2.2.5-win10-x64/bin/fluidsynth.exe" );
    //p.setArguments( {"../antarctica/fluidsynth-2.2.5-win10-x64/sf/TimGM6mb.sf2", QString::fromStdString( filename ), "-F", QString::fromStdString( filename ).append( ".wav" ) });
    p.setProgram( "fluidsynth" );
    p.setArguments( { "/home/antarctica/antarcticalibs/TimGM6mb.sf2", QString::fromStdString(filename+".mid"), "-F", QString::fromStdString(filename)+".wav" , "-r", "48000", "-O", "s24" });
    p.start();
    p.waitForFinished();
    */

    string soundfont = "/home/antarctica/antarcticalibs/Touhou.sf2";
    //string command = "fluidsynth /home/antarctica/antarcticalibs/TimGM6mb.sf2 " + filename + ".mid -F " + filename + ".wav -r 48000 -O s24";

    /*
     *
     *
    string command = "fluidsynth  " + soundfont + " " + filename + ".mid -F " + filename + ".wav -r 48000 -O s24";
    system( command.c_str() );
    command = "ffmpeg -y -i " + filename + ".wav -acodec mp3 -ab 128k " + filename + ".mp3";
    system( command.c_str() );
    command = "rm " + filename + ".wav";
    system( command.c_str() );
    */

    string command = "fluidsynth " + soundfont + " " + filename + "-loop.mid -F " + filename + "-loop-cut.wav -r 48000 -O s24";
    system( command.c_str() );
    //command = "sox " + filename + "-loop-cut.wav " + filename + "-loop.wav " + " trim 0 209452s"; // 55 bpm
    command = "sox " + filename + "-loop-cut.wav " + filename + "-loop.wav " + " trim 0 76800s"; //
    system( command.c_str() );
    command = "ffmpeg -y -i " + filename + "-loop.wav -acodec mp3 -ab 128k " + filename + "-loop.mp3";
    system( command.c_str() );
    //command = "rm " + filename + "-loop.wav";
    //system( command.c_str() );

    //cout << "saved " << filename << endl;
}

//////////////////////////////
//
// getTempo -- get the current tempo
//

/*
double Midigen::getTempo(int index) {
    MidiEvent& mididata = midiIn[0][index];

    int microseconds = 0;
    microseconds = microseconds | (mididata[3] << 16);
    microseconds = microseconds | (mididata[4] << 8);
    microseconds = microseconds | (mididata[5] << 0);

    double tempo = 60.0 / microseconds * 1000000.0;

    //cout << "Tempo " << tempo;
    tempoEvent = mididata;
    double tempo = 60.0;
    return tempo;
}
*/

//////////////////////////////
//
// setTempo -- set the current tempo
//

void Midigen::setTempo(double factor) {

    tempoEvent.setTempo(factor);
    /*
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
    */

}
