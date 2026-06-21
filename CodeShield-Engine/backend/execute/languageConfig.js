/**
 * Polymorphic Language Execution Matrix Configuration.
 *
 * Each entry defines:
 *  - extension: file extension used when writing the source file to disk
 *  - fixedFilename: (optional) a required filename, e.g. Main.java
 *  - needsCompile: whether a separate compilation phase is required
 *  - getCompileCommand(filename, dir): shell command to compile the source.
 *      `dir` is the working directory -- either the real host job directory
 *      (direct execution) or "/sandbox" (inside the Docker runner container).
 *      `filename` is just the source file's basename (e.g. "source.cpp" or
 *      "Main.java"); commands should join it with `dir` themselves so the
 *      same generator works for both host paths and container paths.
 *  - getRunCommand(filename, dir): shell command to execute the (compiled) program.
 *  - boilerplate: starter code injected into the editor when this language is selected
 *  - monacoLanguage: the language identifier passed to the Monaco editor
 *
 * Both getCompileCommand and getRunCommand receive plain POSIX-style
 * directories ("dir") and must build their own joined paths using "/" so
 * that the resulting command is valid both on the host (when run directly)
 * and inside the Linux-based Docker runner (when run sandboxed).
 */

const LANGUAGE_CONFIG = {
    python: {
        label: 'Python 3',
        extension: 'py',
        monacoLanguage: 'python',
        needsCompile: false,
        getRunCommand: (filename, dir) => `python3 "${dir}/${filename}"`,
        boilerplate:
`# Python 3
import sys

def main():
    data = sys.stdin.read()
    # Write your solution below
    pass

if __name__ == "__main__":
    main()
`
    },

    javascript: {
        label: 'JavaScript (Node)',
        extension: 'js',
        monacoLanguage: 'javascript',
        needsCompile: false,
        getRunCommand: (filename, dir) => `node "${dir}/${filename}"`,
        boilerplate:
`// JavaScript (Node.js)
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputData = '';
process.stdin.on('data', (chunk) => inputData += chunk);
process.stdin.on('end', () => {
    // Write your solution below
});
`
    },

    c: {
        label: 'C',
        extension: 'c',
        monacoLanguage: 'c',
        needsCompile: true,
        getCompileCommand: (filename, dir) => `gcc "${dir}/${filename}" -o "${dir}/a.out" -O2 -lm`,
        getRunCommand: (filename, dir) => `"${dir}/a.out"`,
        boilerplate:
`#include <stdio.h>

int main() {
    // Write your solution below

    return 0;
}
`
    },

    cpp: {
        label: 'C++',
        extension: 'cpp',
        monacoLanguage: 'cpp',
        needsCompile: true,
        getCompileCommand: (filename, dir) => `g++ "${dir}/${filename}" -o "${dir}/a.out" -O2 -std=c++17`,
        getRunCommand: (filename, dir) => `"${dir}/a.out"`,
        boilerplate:
`#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution below

    return 0;
}
`
    },

    java: {
        label: 'Java',
        extension: 'java',
        monacoLanguage: 'java',
        needsCompile: true,
        // Java source files must be named after the public class (Main.java).
        // generateFile handles writing to a file literally named Main.java.
        fixedFilename: 'Main.java',
        getCompileCommand: (filename, dir) => `javac "${dir}/${filename}" -d "${dir}"`,
        getRunCommand: (filename, dir) => `java -cp "${dir}" Main`,
        boilerplate:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your solution below

    }
}
`
    },

    bash: {
        label: 'Bash',
        extension: 'sh',
        monacoLanguage: 'shell',
        needsCompile: false,
        getRunCommand: (filename, dir) => `bash "${dir}/${filename}"`,
        boilerplate:
`#!/bin/bash
# Bash script
read input

# Write your solution below
`
    }
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG);

module.exports = { LANGUAGE_CONFIG, SUPPORTED_LANGUAGES };
