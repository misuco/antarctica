cmake_minimum_required(VERSION 3.14)

project(antarctica LANGUAGES C CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

##############################
# midifile

include(CheckIncludeFiles)
include(GNUInstallDirs)

include_directories(midifile/include)

check_include_files(unistd.h HAVE_UNISTD_H)
check_include_files(humdrum.h HAVE_HUMDRUM_H)
check_include_files(sys/io.h HAVE_SYS_IO_H)

##############################
##
## Library:
##

set(SRCS
    midifile/src/Options.cpp
    midifile/src/Binasc.cpp
    midifile/src/MidiEvent.cpp
    midifile/src/MidiEventList.cpp
    midifile/src/MidiFile.cpp
    midifile/src/MidiMessage.cpp
)

set(HDRS
    midifile/include/Binasc.h
    midifile/include/MidiEvent.h
    midifile/include/MidiEventList.h
    midifile/include/MidiFile.h
    midifile/include/MidiMessage.h
    midifile/include/Options.h
)


add_library(midifile STATIC ${SRCS} ${HDRS})

set(SOURCES main.cpp midicalc.cpp midicalc.hpp )

##############################
add_executable(antarctica ${SOURCES} ${RESOURCES} )
target_link_libraries(antarctica midifile )
