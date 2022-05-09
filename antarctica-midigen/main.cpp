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


    mc.loadChordMap( "/home/c1/MISUCO/antarctica/data/chords.csv" );
    mc.loadScaleMap( "/home/c1/MISUCO/antarctica/data/scales_cleaned_sorted.csv" );
    mc.loadMidiFile( "/home/c1/ownCloud/studio-exchange/schoenberg/Midi/Schoenberg_-_Sechs_kleine_Klavierstcke_Op._19.mid" );
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

    vector<Midicalc::BlockConfig> config;

    if( arrange == 1 ) {
        for(int r=0;r<=20;r++) {
            config.push_back( { block, pitch+r*2, 20 + r*20 } );
        }
        for(int r=0;r<10;r++) {
            config.push_back( { block, pitch+40, 420 } );
        }
        for(int r=20;r>=0;r--) {
            config.push_back( { block, pitch+r*2, 20 + r*20 } );
        }
//    } else if( arrange == 2 ) {
//        for(int r=0;r<repeat;r++) {
//        }
    } else {
        for(int r=0;r<repeat;r++) {
            for(int c=0;c<loopLength;c++) {
                config.push_back( { block+c, pitch, tempo } );
            }
        }
    }

    createNewSong( target, tempo, config, scale, basenote  );

    //createNewSong( target, tempo, config );

    /*
    int from=0;
    int to=999999;

    QFile file("../antarctica/AntarcticNames.csv");
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
        return 0;

    int timestamp = 1645492942;  // 2022-02-22 02:22:22
    int linecount = 0;
    int minlen = 100;
    int maxlen = 0;

    QString minname;
    QString maxname;

    QMap<QString, int> spotTypes;

    QMap<QString, QStringList> itemsByDate;

    file.readLine();

    while (!file.atEnd()) {
        QString line = QString::fromLatin1( file.readLine() );
        QStringList items = line.split( ";" );
        linecount++;

        QString date1 = items.at(11);
        QString date2 = items.at(13);
        QString date3 = items.at(14);
        QString date = date3.isEmpty() ? ( date2.isEmpty() ? date1 : date2 ) : date3;

        QString year  = date.right(4);
        QString month = date.left(2);
        QString day   = date.mid(3,2);

        QString latitude = items.at(3);
        QString longitude = items.at(4);

        QString index = QString("%1-%2-%3-%4-%5-%6").arg( year,month,day,latitude,longitude ).arg( items.at(0),5,'0');

        qDebug() << " read line " << index << " into records " << items.at(1) << " looping from " << items.at(2) << " lat " << latitude << " lon " << longitude;
        itemsByDate.insert( index, items );
    }

    file.close();

    qDebug() << " read lines " << linecount << " into records " << itemsByDate.size() << " looping from " << from << " to " << to;

    /*
    QDateTime dateTime;
    dateTime.setTimeZone( QTimeZone::utc() );

    linecount = 0;
    for( const auto& date : itemsByDate.keys() ) {

        QStringList items = itemsByDate[ date ];

        linecount++;

        QString name = items.at(1);
        QString type = items.at(2);
        QString latitude = items.at(3);
        QString longitude = items.at(4);
        QString date1 = items.at(11);
        QString date2 = items.at(14);
        QString description = items.at(15);

        int itemlen = items.at(1).length();
        if( itemlen > maxlen ) {
            maxlen = itemlen;
            maxname = name;
        }
        if( itemlen < minlen ) {
            minlen = itemlen;
            minname = name;
        }

        spotTypes[ type ]++;

        dateTime = QDateTime::fromSecsSinceEpoch( timestamp );
        timestamp+=60;

        if( linecount >= from && linecount < to ) {
            vector<Midicalc::BlockConfig> config;

            qDebug() << QString("%1 %2 %3 %4 %5 %6 %7").arg( linecount, 5 ).arg( name, -20 ).arg( type, -10).arg( latitude, 8).arg( longitude, 8).arg( date1, 11 ).arg( date2, 11 );
            QString filename = QString( "%1-%2.mid" ).arg( linecount, 5, 10, QChar('0') ).arg( name.replace(QRegularExpression("\\s+"),"_") );

            QString nameForRandom = name;
            nameForRandom.replace(QRegularExpression("\\s+"),"");

            int randomLen = nameForRandom.length();

            int tempo = 60 + (linecount % 180);
            int nBeats = 4 + nameForRandom.length() % (tempo / 16);

            int blockVariance = 1 + (nameForRandom.at(0).toLatin1() % (nBeats / 3) );
            qDebug() << "beats " << nBeats << " tempo " << tempo << " variance " << blockVariance;

            vector<int> blockVariants;
            for(int i=0;i<blockVariance;i++) {
                int sum=0;
                for(int j=0;j<4;j++) {
                    int charIndex = (i*4+j) % randomLen;
                    sum+=nameForRandom.at(charIndex).toLatin1();
                }
                int blockNr = sum % 186;
                blockVariants.push_back( blockNr );
                quarterHistogram[ blockNr ]++;
            }

            int sum=0;
            int transpose=0;
            for(int i=0;i<nBeats;i++) {
                int charIndex1 = i % randomLen;
                int charIndex2 = (i+1) % randomLen;
                sum+=nameForRandom.at(charIndex1).toLatin1();
                int block = blockVariants.at( sum % blockVariance );

                int transposeValue = (sum + nameForRandom.at(charIndex2).toLatin1() ) % 5;
                switch(sum%3) {
                case 1:
                    transpose+=transposeValue;
                    break;
                case 2:
                    transpose-=transposeValue;
                    break;
                }

                config.push_back( { block, transpose } );
                //qDebug() << "block " << block << " trans " << transpose;
            }
            createNewSong( filename, tempo, config );
        }
    }

    for( auto &nr : quarterHistogram.keys() ) {
        qDebug() << "block " << nr << " " << quarterHistogram[ nr ];
    }
    */

    return 0;
}
