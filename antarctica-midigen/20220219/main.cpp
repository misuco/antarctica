#include <QCoreApplication>
#include <QFile>
#include <QMap>
#include <QDateTime>
#include <QTimeZone>
#include <QRegularExpression>
#include <QDebug>

#include "midicalc.hpp"

int main(int argc, char *argv[])
{

    Midicalc mc;

    int from=0;
    int to=999999;


    if(argc > 1) {
        mc.loadMidiFile( QString::fromLocal8Bit(argv[1]).toStdString() );
        mc.analyzeMidiFile();
    }
    if(argc > 2) {
        from = QString::fromLocal8Bit(argv[2]).toInt();
    }

    if(argc > 3) {
        to = QString::fromLocal8Bit(argv[3]).toInt();
    }

    QCoreApplication a(argc, argv);

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
        QString line = QString::fromLocal8Bit( file.readLine() );
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

        itemsByDate.insert( index, items );
    }

    file.close();

    qDebug() << " read lines " << linecount << " into records " << itemsByDate.size();

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
            qDebug() << QString("%1 %2 %3 %4 %5 %6 %7 %8 %9 %10").arg( linecount, 5 ).arg( date, 33 ).arg( timestamp ).arg( dateTime.toString(),15  ).arg( name, 35 ).arg( type, 15).arg( latitude, 8).arg( longitude, 8).arg( date1, 11 ).arg( date2, 11 );

            vector<Midicalc::BlockConfig> config;

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
                blockVariants.push_back( sum % 186 );
            }

            /*

            int transposeVariance = 1 + (nameForRandom.at(1).toLatin1() % nBeats );
            int alternatingStyle = (nameForRandom.at(2).toLatin1() % 8);


            vector<int> transposeVariants;
            for(int i=0;i<blockVariance;i++) {
                int sum=0;
                for(int j=0;j<3;j++) {
                    int charIndex = (i*3+j) % randomLen;
                    sum+=nameForRandom.at(charIndex).toLatin1();
                }
                transposeVariants.push_back( sum % 12 );
            }
            */

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


            mc.setBPM( tempo );

            mc.newMidiFile( config );
            //QString filename = QString( "./aa%1-%2-%3-%4-%5.mid" ).arg( linecount ).arg( dateTime.date().day() ).arg( dateTime.time().hour() ).arg( dateTime.time().minute() ).arg( dateTime.time().second() );
            QString filename = QString( "%1-%2.mid" ).arg( linecount, 5, 10, QChar('0') ).arg( name.replace(QRegularExpression("\\s+"),"_") );

            qDebug() << filename;

            mc.saveNewMidiFile( filename.toStdString() );

        }
    }

    /*
    qDebug() << "count  " << linecount;
    qDebug() << "minlen " << minname << " " << minlen;
    qDebug() << "maxlen " << maxname << " " << maxlen;

    for( auto &type : spotTypes.keys() ) {
        qDebug() << type << " " << spotTypes[ type ];
    }
   */
    return 0;
}
