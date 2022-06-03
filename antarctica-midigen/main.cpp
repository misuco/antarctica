#include <QCoreApplication>
#include <QFile>
#include <QMap>
#include <QDateTime>
#include <QTimeZone>
#include <QRegularExpression>
#include <QDebug>
#include <QCommandLineParser>

#include "midicalc.hpp"

Midicalc mc;
QMap<int, int> quarterHistogram;

void createNewSong( QString filename, int tempo, vector<Midicalc::BlockConfig> config, int scale, int basenote) {
    //qDebug() << QString("%1 %2 %3 %4 %5 %6 %7 %8 %9 %10").arg( linecount, 5 ).arg( date, 33 ).arg( timestamp ).arg( dateTime.toString(),15  ).arg( name, 35 ).arg( type, 15).arg( latitude, 8).arg( longitude, 8).arg( date1, 11 ).arg( date2, 11 );

    mc.setBPM( tempo );

    mc.initScaleFilter(scale,basenote);

    mc.newMidiFile( config );
    //QString filename = QString( "./aa%1-%2-%3-%4-%5.mid" ).arg( linecount ).arg( dateTime.date().day() ).arg( dateTime.time().hour() ).arg( dateTime.time().minute() ).arg( dateTime.time().second() );

    qDebug() << filename << " tempo " << tempo;

    mc.saveNewMidiFile( filename.toStdString() );

}

int main(int argc, char *argv[])
{
    QCoreApplication app(argc, argv);

    QFile file1( ":/data/chords.csv" );
    if( file1.exists() ) { qDebug() << "chords.csv exists"; } else { qDebug() << "chords.csv does NOT exist"; }
    QFile file2( ":/data/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
    if( file2.exists() ) { qDebug() << "_Sechs_kleine_Klavierstcke_Op exists"; } else  { qDebug() << "_Sechs_kleine_Klavierstcke_Op does NOT exist"; }

    mc.loadChordMap( ":/data/chords.csv" );
    mc.loadScaleMap( ":/data/scales_cleaned_sorted.csv" );
    //mc.loadMidiFile( ":/data/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
    //mc.loadMidiFile( "/home/c1/ownCloud/studio-exchange/schoenberg/Midi/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
    mc.loadMidiFile( "/home/antarctica/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
    mc.analyzeMidiFile();

    for(int i=0;i<argc;i++) {
        qDebug() << "Param " << QString::fromLocal8Bit(argv[i]);
    }

    QCommandLineParser parser;

    // A boolean option with a single name (-p)
    QCommandLineOption outputOption("o", QCoreApplication::translate("output", "Destination to write files"),
                                    QCoreApplication::translate("main", "Copy all source files into <directory>."),
                                    QCoreApplication::translate("main", "directory"));
    parser.addOption(outputOption);

    QCommandLineOption blockOption("b", QCoreApplication::translate("block", "Start block to play"),
    QCoreApplication::translate("main", "Copy all source files into <directory>."),
    QCoreApplication::translate("main", "directory"));
    parser.addOption(blockOption);

    QCommandLineOption loopLengthOption("l", QCoreApplication::translate("loop length", "Numbers of blocks from start block to loop"),
    QCoreApplication::translate("main", "Copy all source files into <directory>."),
    QCoreApplication::translate("main", "directory"));
    parser.addOption(loopLengthOption);

    QCommandLineOption repeatOption("r", QCoreApplication::translate("repeat", "Numbers of loop repeat"),
    QCoreApplication::translate("main", "Copy all source files into <directory>."),
    QCoreApplication::translate("main", "directory"));
    parser.addOption(repeatOption);

    QCommandLineOption tempoOption("t", QCoreApplication::translate("tempo", "Tempo value"),
    QCoreApplication::translate("main", "Copy all source files into <directory>."),
    QCoreApplication::translate("main", "directory"));
    parser.addOption(tempoOption);

    QCommandLineOption pitchOption("p", QCoreApplication::translate("pitch", "Pitch value"),
                            QCoreApplication::translate("main", "Copy all source files into <directory>."),
                            QCoreApplication::translate("main", "directory"));
    parser.addOption(pitchOption);

    QCommandLineOption scaleOption("s", QCoreApplication::translate("scale", "Scale value"),
                            QCoreApplication::translate("main", "Copy all source files into <directory>."),
                            QCoreApplication::translate("main", "directory"));
    parser.addOption(scaleOption);

    QCommandLineOption basenoteOption("n", QCoreApplication::translate("basenote", "basenote value"),
                            QCoreApplication::translate("main", "Copy all source files into <directory>."),
                            QCoreApplication::translate("main", "directory"));
    parser.addOption(basenoteOption);

    QCommandLineOption arrangeOption("a", QCoreApplication::translate("arrange", "arrange value"),
                            QCoreApplication::translate("main", "Copy all source files into <directory>."),
                            QCoreApplication::translate("main", "directory"));
    parser.addOption(arrangeOption);

    // Process the actual command line arguments given by the user
    parser.process(app);

    QString target = parser.value(outputOption);
    int block = parser.value(blockOption).toInt();
    int loopLength = parser.value(loopLengthOption).toInt();
    int repeat = parser.value(repeatOption).toInt();
    int pitch = parser.value(pitchOption).toInt();
    int tempo = parser.value(tempoOption).toInt();
    int scale = parser.value(scaleOption).toInt();
    int basenote = parser.value(basenoteOption).toInt();
    int arrange = parser.value(arrangeOption).toInt();

    qDebug() << "got request block: " << block << " pitch: " << pitch << " tempo: " << tempo << " repeat: " << repeat << " loopLength: " << loopLength << " scale: " << scale << " basenote: " << basenote << " arrange: " << arrange << " " << target;

    double secondsPerQuarter = 60.0 / tempo;
    double playTime = 0;
    double minPlayTime = 30;
    double maxPlayTime = 120;

    qDebug() << "seconds per quarter: " << secondsPerQuarter;

    vector<Midicalc::BlockConfig> config;

    if( arrange == 1 ) {
        for(int r=0;r<=20;r++) {
            config.push_back( { block, pitch+r*2, 20 + r*20, basenote, scale } );
        }
        for(int r=0;r<10;r++) {
            config.push_back( { block, pitch+40, 420, basenote, scale } );
        }
        for(int r=20;r>=0;r--) {
            config.push_back( { block, pitch+r*2, 20 + r*20, basenote, scale } );
        }
    } else if( arrange == 2 ) {
        for(int r=0;(r<repeat || playTime<minPlayTime) && playTime<maxPlayTime;r++) {
            config.push_back( { block, pitch, tempo, basenote, scale } );
            config.push_back( { block, pitch + 5, tempo, basenote, scale } );
            config.push_back( { block, pitch + 4, tempo, basenote, scale } );
            config.push_back( { block, pitch + 9, tempo, basenote, scale } );
            playTime += secondsPerQuarter * 4;
        }
    } else if( arrange == 3 ) {
        for(int r=0;(r<repeat || playTime<minPlayTime) && playTime<maxPlayTime;r++) {
            config.push_back( { block, pitch, tempo, basenote, scale } );
            config.push_back( { block, pitch + 1, tempo, basenote, scale } );
            config.push_back( { block, pitch + 2, tempo, basenote, scale } );
            config.push_back( { block, pitch + 3, tempo, basenote, scale } );
            config.push_back( { block, pitch + 4, tempo, basenote, scale } );
            config.push_back( { block, pitch + 5, tempo, basenote, scale } );
            config.push_back( { block, pitch + 6, tempo, basenote, scale } );
            config.push_back( { block, pitch + 7, tempo, basenote, scale } );
            config.push_back( { block, pitch + 8, tempo, basenote, scale } );
            config.push_back( { block, pitch + 9, tempo, basenote, scale } );
            config.push_back( { block, pitch + 10, tempo, basenote, scale } );
            config.push_back( { block, pitch + 11, tempo, basenote, scale } );
            playTime += secondsPerQuarter * 12;
        }
    } else if( arrange == 4 ) {
        for(int r=0;(r<repeat || playTime<minPlayTime) && playTime<maxPlayTime;r++) {
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch, tempo, basenote, scale } );
            }
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch + 5, tempo, basenote, scale } );
            }
            for(int c=0;c<loopLength*4;c++) {
                config.push_back( { block+c, pitch, tempo * 4, basenote, scale } );
            }
            for(int c=0;c<loopLength*4;c++) {
                config.push_back( { block+c, pitch + 5, tempo * 4, basenote, scale } );
            }
            for(int c=0;c<loopLength*8;c++) {
                config.push_back( { block+c, pitch, tempo * 8, basenote, scale } );
            }
            for(int c=0;c<loopLength*8;c++) {
                config.push_back( { block+c, pitch + 5, tempo * 8, basenote, scale } );
            }
            for(int c=0;c<loopLength*16;c++) {
                config.push_back( { block+c, pitch, tempo * 16, basenote, scale } );
            }
            for(int c=0;c<loopLength*16;c++) {
                config.push_back( { block+c, pitch + 5, tempo * 16, basenote, scale } );
            }
            playTime += secondsPerQuarter * 8 * loopLength;
        }
    } else if( arrange == 5 ) {
        for(int s=0;(s<repeat || playTime<minPlayTime) && playTime<maxPlayTime;s++) {
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch, tempo, basenote, scale+s } );
            }
            playTime += secondsPerQuarter * loopLength;
        }
    } else if( arrange == 6 ) {
        for(int n=0;(n<repeat || playTime<minPlayTime) && playTime<maxPlayTime;n++) {
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch, tempo, basenote+n*2, scale } );
            }
            playTime += secondsPerQuarter * loopLength;
        }
    } else if( arrange == 7 ) {
        for(int r=0;(r<repeat || playTime<minPlayTime) && playTime<maxPlayTime;r++) {
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch-24, tempo, basenote, scale } );
            }
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch+24, tempo, basenote, scale } );
            }
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch-12, tempo, basenote, scale } );
            }
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch+12, tempo, basenote, scale } );
            }
            playTime += secondsPerQuarter * loopLength * 4;
        }
    } else if( arrange == 8 ) {
        for(int r=0;(r<repeat || playTime<minPlayTime) && playTime<maxPlayTime;r++) {
            config.push_back( { block, pitch, tempo, basenote, scale } );
            config.push_back( { block, pitch, tempo, basenote, scale } );
            config.push_back( { block, pitch + 5, tempo, basenote, scale } );
            config.push_back( { block, pitch, tempo, basenote, scale } );
            config.push_back( { block, pitch + 7, tempo, basenote, scale } );
            config.push_back( { block, pitch + 5, tempo, basenote, scale } );
            config.push_back( { block, pitch, tempo, basenote, scale } );
            config.push_back( { block, pitch - 4, tempo, basenote, scale } );
            playTime += secondsPerQuarter * 8;
        }
    } else if( arrange == 9 ) {
        for(int r=0;(r<repeat || playTime<minPlayTime) && playTime<maxPlayTime;r++) {
            config.push_back( { block, pitch + 11, tempo, basenote, scale } );
            config.push_back( { block, pitch + 4, tempo, basenote, scale } );
            config.push_back( { block, pitch + 9, tempo, basenote, scale } );
            config.push_back( { block, pitch + 2, tempo, basenote, scale } );
            config.push_back( { block, pitch + 7, tempo, basenote, scale } );
            config.push_back( { block, pitch - 1, tempo, basenote, scale } );
            config.push_back( { block, pitch, tempo, basenote, scale } );
            config.push_back( { block, pitch + 4, tempo, basenote, scale } );
            playTime += secondsPerQuarter * 8;
        }
    } else {
        for(int r=0;(r<repeat || playTime<minPlayTime) && playTime<maxPlayTime;r++) {
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch, tempo, basenote, scale } );
            }
            playTime += secondsPerQuarter * loopLength;
        }
    }

    createNewSong( target, tempo, config, scale, basenote  );

    qDebug() << "seconds per quarter: " << secondsPerQuarter;
    qDebug() << "play time: " << playTime;

    return 0;
}
