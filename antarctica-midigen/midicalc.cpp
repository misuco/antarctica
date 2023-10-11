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

#include "midicalc.hpp"
#include <sstream>
#include <stdlib.h>

int Midicalc::lookupKey(int key) {
    int lookedUpKey=0;
    if(keyLookupMap.find(key) == keyLookupMap.end()) {
        bool keyFound=false;
        while (keyFound==false) {
            int command = midiIn[0][pitchIndex][0] & 0xf0;
            if(command == 0x90) {
                lookedUpKey = midiIn[0][pitchIndex][1];
                keyFound=true;
                keyLookupMap[key]=lookedUpKey;
            }
            pitchIndex++;

            // if end of lookup block is reached
            if(pitchIndex>toPitchIndex) {
                // if keys were found, start from scrach
                if(keyLookupMap.size()>0) {
                    pitchIndex=fromPitchIndex;

                // else no keys in block, return original key
                } else {
                    lookedUpKey=key;
                    keyFound=true;
                }
            }
        }
    } else {
        lookedUpKey=keyLookupMap[key];
    }
    return lookedUpKey;
}

int Midicalc::filterKey(int key) {

    if(key>=scaleFilterHighestNote) {
        return scaleFilterHighestNote;
    } else if(key<=scaleFilterLowestNote) {
        return scaleFilterLowestNote;
    } else if(scaleFilterMap[key] == -1) {
        int mapKeyUp=key;
        int mapKeyDown=key;

        while(scaleFilter.at(mapKeyDown)!=true && scaleFilter.at(mapKeyUp)!=true ) {
            mapKeyDown--;
            mapKeyUp++;
        }
        if( scaleFilter.at(mapKeyUp)==true) {
            scaleFilterMap[key] = mapKeyUp;
        } else if( scaleFilter.at(mapKeyDown)==true ) {
            scaleFilterMap[key] = mapKeyDown;
        }
    }
    return scaleFilterMap[key];
}

void Midicalc::setBPM(int b)
{
    if(b==0) b=1;
    bpm = b;
    currentTempo = setTempo( currentTempo / bpm );
}

void Midicalc::setRhythmSourceCluster(int c)
{
    int clustersSize=clusters.size();
    if(c>=clustersSize) c=clustersSize-1;
    fromRhythmBlock = clusters[c].blockBegin;
    toRhythmBlock = clusters[c].blockEnd;
    fromRhythmIndex = clusters[c].indexBegin;
    toRhythmIndex = clusters[c].indexEnd;
    origBpm = clusters[c].tempoInit;
}

void Midicalc::setPitchSourceCluster(int c)
{
    int clustersSize=clusters.size();
    if(c>=clustersSize) c=clustersSize-1;
    fromPitchBlock = clusters[c].blockBegin;
    toPitchBlock = clusters[c].blockEnd;
    fromPitchIndex = clusters[c].indexBegin;
    toPitchIndex = clusters[c].indexEnd;
}

void Midicalc::setRhythmSourceBlock(int q)
{
    int blocksSize=blocks.size();
    if(q>=blocksSize) q=blocksSize-1;
    fromRhythmBlock = blocks[q].blockBegin;
    toRhythmBlock = blocks[q].blockEnd;
    fromRhythmIndex = blocks[q].indexBegin;
    toRhythmIndex = blocks[q].indexEnd;
    origBpm = blocks[q].tempoInit;
}

void Midicalc::setPitchSourceBlock(int q)
{
    int blocksSize=blocks.size();
    if(q>=blocksSize) q=blocksSize-1;
    fromPitchBlock = blocks[q].blockBegin;
    toPitchBlock = blocks[q].blockEnd;
    fromPitchIndex = blocks[q].indexBegin;
    toPitchIndex = blocks[q].indexEnd;
}

void Midicalc::setRepeat(int n)
{
    repeat = n;
}

void Midicalc::setTranspose(int n)
{
    transpose = n;
}

void Midicalc::initScaleFilter(int scale, int basenote)
{
    int scalePoolSize=scalePool.size();
    if(scale>=scalePoolSize) scale=scalePoolSize-1;

    //cout << "Scale: " << scaleMap[scalePool.at(scale)] << endl;
    //cout << "Basenote: " << midinote2txt(basenote) << endl;

    // clear existing filter
    scaleFilter.clear();
    scaleFilterMap.clear();
    for(int i=0;i<127;i++) {
        scaleFilter.push_back( false );
        scaleFilterMap.push_back( -1 );
    }

    // seek lowest hearable note
    scaleFilterLowestNote = basenote;
    while(scaleFilterLowestNote<21) { scaleFilterLowestNote+=12; }

    // get record
    vector<string> scaleSteps;
    istringstream f(scalePool.at(scale));
    string s;
    while (getline(f, s, '-')) {
        //cout << s << endl;
        scaleSteps.push_back(s);
    }

    int stepI = 0;
    for(int i=scaleFilterLowestNote;i<127;) {
        scaleFilter.at(i)=true;
        scaleFilterHighestNote=i;

        if(scaleSteps.at(stepI)=="H") {
            i+=1;
        } else if(scaleSteps.at(stepI)=="W") {
            i+=2;
        } else if(scaleSteps.at(stepI)=="2W") {
            i+=4;
        } else if(scaleSteps.at(stepI)=="3H") {
            i+=3;
        } else {
            cout << "WARNING: unknown step token " << scaleSteps.at(stepI) << endl;
        }
        stepI++;
        int scaleStepsSize=scaleSteps.size();
        if(stepI>=scaleStepsSize) {
            stepI=0;
        }
    }
}


//////////////////////////////
//
// convertMidiFileToText --
//

Midicalc::Midicalc() :
    bpm { 125 },
    outputPath { "/home/c1/MISUCO/antarctica-files/" }
{
    //QDir d;
    //d.mkdir(outputPath+"wav");
    //d.mkdir(outputPath+"mid");
}

void Midicalc::loadChordMap(string filename)
{
    ifstream file(filename);
    string line;

    if(!file.is_open()) return;

    while(getline(file,line)) {
        vector<string> fields;// = line.split(";");
        istringstream f(line);
        string s;
        while (getline(f, s, ';')) {
            //cout << s << endl;
            fields.push_back(s);
        }

        if(fields.size()>2) {
            chordMap[fields.at(2)] = fields.at(0);
            //cout << "loaded chord " << fields.at(0) << endl;
        } else {
            //cout << "invalid record " << line << endl;
        }
    }

}
void Midicalc::loadScaleMap(string filename)
{
    ifstream file(filename);
    string line;

    if(!file.is_open()) return;

    while(getline(file,line)) {
        vector<string> fields;// = line.split(";");
        istringstream f(line);
        string s;
        while (getline(f, s, ';')) {
            //cout << s << endl;
            fields.push_back(s);
        }

        if(fields.size()>2) {
            scaleMap[fields.at(2)] = fields.at(0);
            scalePool.push_back(fields.at(2));
            //cout << "loaded chord " << fields.at(0) << endl;
        } else {
            //cout << "invalid record " << line << endl;
        }
    }

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

    tempoEvent.tick = 0;
    midiOut.addEvent( 1, 0, tempoEvent );


    //int tickOffset = 0;

    //cout << "new track with tick offset " << tickOffset << "\n";
    //cout << "events from " << fromBeat  << "(i:" << fromIndex << ") to " << toBeat << "(i:" << toIndex << ")\n";

    cout << "Scale: " << scaleMap[scalePool.at(blockConfigs.at(0).scale)] << endl;
    cout << "Basenote: " << midinote2txt(blockConfigs.at(0).note) << endl;

    /* loop n */

    int nBlocks;

    int loopOffset = 0;
    int n=0;

    int previousSound = -1;

    for( auto& config: blockConfigs) {

        //cout << " - create Block " << config.block << " trans " << config.transpose << endl;

        setRhythmSourceCluster( config.rhythmBlock );
        setPitchSourceCluster( config.pitchBlock );
        setTranspose( config.transpose );
        initScaleFilter( config.scale, config.note );
        if(config.tempo > 0) {
            tempoEvent.tick = loopOffset;
            setBPM( config.tempo );
            midiOut.addEvent( 1, loopOffset, tempoEvent );
        }

        nBlocks = toRhythmBlock - fromRhythmBlock + 1;

        if(config.sound!=previousSound) {
            {
                MidiEvent pc( 192, config.sound );
                midiOut.addEvent( 0, loopOffset, pc );
                midiOut.addEvent( 1, loopOffset, pc );
            }
            {
                MidiEvent pc( 193, config.sound );
                midiOut.addEvent( 0, loopOffset, pc );
                midiOut.addEvent( 1, loopOffset, pc );
            }
            {
                MidiEvent pc( 194, config.sound );
                midiOut.addEvent( 0, loopOffset, pc );
                midiOut.addEvent( 1, loopOffset, pc );
            }
            previousSound=config.sound;
        }

        //cout << loopOffset << "   * beat  " << n << " from " << fromQuarter << " to " << toQuarter << " nBlocks " << nBlocks << endl;
        //cout << "   * index " << n << " from " << fromIndex << " to " << toIndex << endl;
        //cout << "   * tempo " << config.tempo << endl;
        n++;
        pitchIndex=fromPitchIndex;

        for(int rhythmIndex=fromRhythmIndex;rhythmIndex<=toRhythmIndex;rhythmIndex++) {

            int command = midiIn[0][rhythmIndex][0] & 0xf0;
            int originalTick = midiIn[0][rhythmIndex].tick;
            int translatedTick = originalTick - fromRhythmBlock * tpq;
            int destinationTick = translatedTick + loopOffset;

            //qDebug() << " event at tick " << originalTick << " translated " << translatedTick;

            // 0x80: Note Off
            // 0x90: Note On
            if (command == 0x90 || command == 0x80) {

                int key = lookupKey(midiIn[0][rhythmIndex][1]);

                int keyTransposed = key + transpose;
                if(keyTransposed>127) keyTransposed=127;
                if(keyTransposed<24) keyTransposed=24;
                int newkey = filterKey(keyTransposed);
                int velocity = midiIn[0][rhythmIndex][2];
                int newvelocity = velocity;
                //if(newvelocity>127) newvelocity=127;

                for(unsigned long j=0;j<midiIn[0][rhythmIndex].size();j++) {
                    midievent[j] = midiIn[0][rhythmIndex][j];
                }
                if(velocity == 0) {
                    newvelocity = 0;
                    midievent[0] = 0x80 + (midievent[0] & 0x0f);
                }
                midievent[1] = newkey;
                midievent[2] = newvelocity;

                //cout << " dest " << destinationTick << " \n";
                midiOut.addEvent( 1, destinationTick /*+ tickOffset*/, midievent );

                string noteType = ( ( midievent[0] & 0xf0 ) == 0x90 ? " on " : " off " );

                //cout << " added @  " << destinationTick << " " << i << ". note " << noteType << " velocity " << newvelocity << " " << midinote2txt(key) << " transposed "  << midinote2txt(keyTransposed) << " translated " << midinote2txt(newkey)  << " at " << destinationTick << endl;

            // 0xFF 0x51: Set Tempo Meta message
            } else if (midiIn[0][rhythmIndex][0] == 0xff &&
                       midiIn[0][rhythmIndex][1] == 0x51) {

                /*
                tempoEvent.tick = destinationTick;
                setBPM( config.tempo * getTempo(i) / origBpm  );
                midiOut.addEvent( 1, destinationTick, tempoEvent );
                */

                //cout << "set tempo " << bpm << " orig bpm " << origBpm << " getTempo(i) " << getTempo(i) << " congig tempo " << config.tempo << endl;
                //cout << "unpro event at " << translatedTick + n*tpq*(toBeat-fromBeat) /*+ tickOffset*/ << " command: " << command << "\n";
            }
        }
        loopOffset += tpq*nBlocks;
    }

    /*
    midievent[0] = 0xFF;
    midievent[1] = 0x2F;
    midievent[2] = 0x00;

    int endoftrack = loopOffset + tpq*24;
    midiOut.addEvent( 1, endoftrack, midievent );
    qDebug() << " added EOT @  " << endoftrack;
    */

    midiOutLoop = midiOut;

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

    midiOut.addCopyright( 1, 0, "Antarctica 2023" );
    midiOut.sortTracks();

    midiOutLoop.addCopyright( 1, 0, "Antarctica 2023" );
    midiOutLoop.sortTracks();

}

void Midicalc::saveNewMidiFile(const string &filename)
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
    string command = "fluidsynth  " + soundfont + " " + filename + ".mid -F " + filename + ".wav -r 48000 -O s24";
    system( command.c_str() );
    command = "ffmpeg -i " + filename + ".wav -acodec mp3 -ab 128k " + filename + ".mp3";
    system( command.c_str() );
    command = "rm " + filename + ".wav";
    system( command.c_str() );

    command = "fluidsynth " + soundfont + " " + filename + "-loop.mid -F " + filename + "-loop.wav -r 48000 -O s24";
    system( command.c_str() );
    command = "ffmpeg -i " + filename + "-loop.wav -acodec mp3 -ab 128k " + filename + "-loop.mp3";
    system( command.c_str() );
    command = "rm " + filename + "-loop.wav";
    system( command.c_str() );

    //cout << "saved " << filename << endl;
}

//////////////////////////////
//
// convertMidiFileToText --
//

void Midicalc::analyzeMidiFile() {


    map<int,int> pressedKeys;

    //double offtime = 0.0;

    int beat = 0;

    int key = 0;
    //int vel = 0;

    double previousQuarter=0;

    Block analyzeBlock;
    analyzeBlock.blockBegin = 0;
    analyzeBlock.blockEnd = 0;
    analyzeBlock.indexBegin = 0;
    analyzeBlock.indexEnd = 0;
    analyzeBlock.tempoInit=-1;
    analyzeBlock.tempoMin=9999;
    analyzeBlock.tempoMax=0;
    analyzeBlock.nNoteOn = 0;
    analyzeBlock.nNoteOff = 0;
    analyzeBlock.nEventTempo = 0;
    analyzeBlock.nEventOther = 0;
    analyzeBlock.totalOn = 0;

    Block cluster;
    cluster = analyzeBlock;

    for (int analyzeIndex=0; analyzeIndex<midiIn.getNumEvents(0); analyzeIndex++) {
        int command = midiIn[0][analyzeIndex][0] & 0xf0;
        int tick = midiIn[0][analyzeIndex].tick;
        double quarter = (double)tick / (double)ticksPerQuarterNote;

        beat = quarter / 4;

        analyzeBlock.indexEnd = analyzeIndex;
        analyzeBlock.blockEnd = quarter;

        cluster.indexEnd = analyzeIndex;
        cluster.blockEnd = quarter;

        if( (int)quarter != (int)previousQuarter ) {
            //int quarterPause = (int)quarter - (int)previousQuarter;

            analyzeBlock.indexEnd--;
            analyzeBlock.blockEnd--;

            cluster.indexEnd--;
            cluster.blockEnd--;

            bool nNewNoteEvents = analyzeBlock.nNoteOn + analyzeBlock.nNoteOff;

            harmonicAnalyze(analyzeBlock);

            blocks.push_back(analyzeBlock);

//            if(quarterPause>2 || analyzeIndex==0 || analyzeIndex==midiIn.getNumEvents(0)-1) {
//                cout << "---- pause ---- " << quarterPause << endl;
//                cout << "- block " << blocks.size() << "\tbeat\t" << beat << "\tquarter begin\t" << analyzeBlock.blockBegin << "\tend\t" << analyzeBlock.blockEnd << "\tindex begin\t" << analyzeBlock.indexBegin << "\tend\t" << analyzeBlock.indexEnd << endl;
//                cout << "\ton\t" << analyzeBlock.nNoteOn << "\toff\t" << analyzeBlock.nNoteOff << "\tother\t" << analyzeBlock.nEventOther << "\tonOffdiff\t" << analyzeBlock.nNoteOn - analyzeBlock.nNoteOff << "\tcOn\t" <<  analyzeBlock.totalOn << "\ttempo init\t" << analyzeBlock.tempoInit << "\tmin\t" << analyzeBlock.tempoMin << "\tmax\t" << analyzeBlock.tempoMax << "\tevs\t" << analyzeBlock.nEventTempo << endl;
//                cout << "\ttick min " << midiIn[0][analyzeBlock.indexBegin].tick << " max " << midiIn[0][analyzeBlock.indexEnd].tick << endl;
//            }

            analyzeBlock.blockBegin = quarter;
            analyzeBlock.indexBegin = analyzeIndex;
            analyzeBlock.tempoInit=currentTempo;
            analyzeBlock.tempoMin=currentTempo;
            analyzeBlock.tempoMax=currentTempo;
            analyzeBlock.nNoteOn = 0;
            analyzeBlock.nNoteOff = 0;
            analyzeBlock.nEventTempo = 0;
            analyzeBlock.nEventOther = 0;
            analyzeBlock.totalOn = 0;

            analyzeBlock.notes.clear();
            analyzeBlock.harmonicMap.clear();

            if( cluster.totalOn == 0 && nNewNoteEvents > 0 ) {
                clusters.push_back( cluster );
                cout << "- end cluster -------------------------------------------------------------------------------------------------------------------------------------------------------" << endl;
                cout << "- cluster " << clusters.size() << "\tbeat\t" << beat << "\tquarter begin\t" << cluster.blockBegin << "\tend\t" << cluster.blockEnd << "\tindex begin\t" << cluster.indexBegin << "\tend\t" << cluster.indexEnd << endl;
                cout << "\ton\t" << cluster.nNoteOn << "\toff\t" << cluster.nNoteOff << "\tother\t" << cluster.nEventOther << "\tonOffdiff\t" << cluster.nNoteOn - cluster.nNoteOff << "\tcOn\t" <<  cluster.totalOn << "\ttempo init\t" << cluster.tempoInit << "\tmin\t" << cluster.tempoMin << "\tmax\t" << cluster.tempoMax << "\tevs\t" << cluster.nEventTempo << endl;
                cout << "\ttick min " << midiIn[0][cluster.indexBegin].tick << " max " << midiIn[0][cluster.indexEnd].tick << endl;

                cluster.blockBegin = quarter;
                cluster.indexBegin = analyzeIndex;
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

                //cout << "---------------------------------------------------------------------------------------------------------------------------------------------------------------------" << endl;

            }

        }


        if (command == 0x90 && midiIn[0][analyzeIndex][2] != 0) {
            // NOTE ON
            key = midiIn[0][analyzeIndex][1];
            //vel = midiIn[0][i][2];

            pressedKeys[key]++;
            if(pressedKeys[key]>1) cout << "WARNING: multiple key press for " << key << " in block " << blocks.size() << " quarter  " << quarter << endl;

            analyzeBlock.harmonicMap[tick] = pressedKeys;
            analyzeBlock.notes[key]++;
            analyzeBlock.nNoteOn++;
            analyzeBlock.totalOn++;

            cluster.harmonicMap[tick] = pressedKeys;
            cluster.notes[key]++;
            cluster.nNoteOn++;
            cluster.totalOn++;

        } else if (command == 0x90 || command == 0x80) {
            // NOTE OFF
            key = midiIn[0][analyzeIndex][1];

            pressedKeys[key]--;
            if(pressedKeys[key]<0) cout << "WARNING: negative key value for " << key << "\n";
            if(pressedKeys[key]<=0) pressedKeys.erase(key);

            analyzeBlock.harmonicMap[tick] = pressedKeys;
            analyzeBlock.nNoteOff++;
            analyzeBlock.totalOn--;

            cluster.harmonicMap[tick] = pressedKeys;
            cluster.nNoteOff++;
            cluster.totalOn--;

        } else if (midiIn[0][analyzeIndex][0] == 0xff &&
                   midiIn[0][analyzeIndex][1] == 0x51) {
            // TEMPO
            currentTempo = getTempo(analyzeIndex);
            if(analyzeBlock.tempoInit == -1) {
                analyzeBlock.tempoInit = currentTempo;
                cluster.tempoInit = currentTempo;
            }

            if(currentTempo>analyzeBlock.tempoMax) analyzeBlock.tempoMax = currentTempo;
            if(currentTempo<analyzeBlock.tempoMin) analyzeBlock.tempoMin = currentTempo;
            analyzeBlock.nEventTempo++;

            if(currentTempo>cluster.tempoMax) cluster.tempoMax = currentTempo;
            if(currentTempo<cluster.tempoMin) cluster.tempoMin = currentTempo;
            cluster.nEventTempo++;

        } else {
            analyzeBlock.nEventOther++;
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

    //cout << "\tnotes\t" << sum << "\tmin\t" << min << "\tmax\t" << max << "\tharmonies\t" << b.harmonicMap.size() << "\n";

    for(auto& harmony:b.harmonicMap) {
        //int prevNote = -1;

        //auto& time  = harmony.first;
        auto& notes = harmony.second;

        //cout << "- n notes: " << notes.size() << " at " << time << "\n";

        disassembleChord( notes );

        /*
        auto it = notes.begin();
        if( notes.size() == 0 ) {
            cout << " silence ";
        } else if( notes.size() == 1 ) {
            cout << " single " << midinote2txt( it->first );
        } else if( notes.size() == 2 ) {
            cout << " interval from " << midinote2txt( it->first );
        } else if( notes.size() == 3 ) {
            int baseNote = it->first;
            std::advance(it, 1);
            int secondNote = it->first;
            std::advance(it, 1);
            int thirdNote = it->first;

            int interval1 = secondNote - baseNote;
            int interval2 = thirdNote - baseNote;

            QString chordQualifier = "0 ";
            chordQualifier.append( QString("%1 ").arg( interval2txt( interval1 )) );
            chordQualifier.append( QString("%1").arg( interval2txt( interval2 )) );

            cout << " chord " << chordQualifier.toStdString();

            if( chordMap.contains( chordQualifier )) {
                cout << " is " << chordMap[ chordQualifier].toStdString();
            } else {
                cout << " is unknown ";
            }
        }

        //vector<int> tripletSteps;
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
            */

        //cout << "\n";
    }
    //cout << "\n";
}

void Midicalc::disassembleChord(map<int,int> pressedKeys) {
    if( pressedKeys.size() > 1) {
        int baseNote = 0;
        bool isFirstNote = true;
        string chordQualifier = "0";
        for(auto key:pressedKeys) {
            if( isFirstNote ) {
                baseNote = key.first;
                isFirstNote = false;
            } else {
                int note  = key.first;
                int interval = note - baseNote;
                chordQualifier.append( " " + interval2txt( interval ) );
            }
        }


        if( chordMap.find(chordQualifier)!=chordMap.cend()) {
            if( pressedKeys.size() > 2 ){
                //cout << " chord " << chordQualifier;
                //cout << " is " << chordMap[chordQualifier] << " from " << midinote2txt(baseNote) << "\n";
            }
        } else {
            //cout << " is unknown \n";
        }

        std::map<int,int> p1 = pressedKeys;
        p1.erase( std::prev(p1.end()));
        disassembleChord( p1 );

        std::map<int,int> p2 = pressedKeys;
        p2.erase( p2.begin() );
        disassembleChord( p2 );

    } else if( pressedKeys.size() == 1) {
        //auto it = pressedKeys.begin();
        //cout << " single " << midinote2txt( it->first ) << "\n";
    } else {
        //cout << " silence \n";
    }
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

string Midicalc::interval2txt(int i)
{
    string txt;
    i = i % 12;
    if( i == 10 ) {
        txt = "t";
    } else if( i == 11 ) {
        txt = "e";
    } else {
        txt = to_string(i);
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

    //cout << "changed Tempo to " << newtempo << "\n";
    return newtempo;

}
