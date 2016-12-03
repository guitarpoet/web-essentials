include(m4lib/core.m4)dnl
FILE_HEADER(`The makefile to build and test the project', `Sat Dec  3 20:52:23 2016')

SECTION_HEADER(`Tasks')

include(Tasks.mk)dnl

PHONY_TASK(`build', `./node_modules/.bin/webpack -p')
