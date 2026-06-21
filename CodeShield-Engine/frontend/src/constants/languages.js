/**
 * Frontend mirror of backend/execute/languageConfig.js.
 *
 * Provides the Monaco language identifier, display label, and boilerplate
 * starter code for each supported language in the 6-language execution
 * matrix. The `value` field is the exact string token sent to the
 * /api/submissions backend payload.
 */

export const LANGUAGES = [
  {
    value: 'python',
    label: 'Python 3',
    monacoLanguage: 'python',
    extension: 'py',
    boilerplate:
`# Python 3
import sys

def main():
    data = sys.stdin.read()
    # Write your solution below
    pass

if __name__ == "__main__":
    main()
`,
  },
  {
    value: 'javascript',
    label: 'JavaScript (Node)',
    monacoLanguage: 'javascript',
    extension: 'js',
    boilerplate:
`// JavaScript (Node.js)
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputData = '';
process.stdin.on('data', (chunk) => inputData += chunk);
process.stdin.on('end', () => {
    // Write your solution below
});
`,
  },
  {
    value: 'c',
    label: 'C',
    monacoLanguage: 'c',
    extension: 'c',
    boilerplate:
`#include <stdio.h>

int main() {
    // Write your solution below

    return 0;
}
`,
  },
  {
    value: 'cpp',
    label: 'C++',
    monacoLanguage: 'cpp',
    extension: 'cpp',
    boilerplate:
`#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution below

    return 0;
}
`,
  },
  {
    value: 'java',
    label: 'Java',
    monacoLanguage: 'java',
    extension: 'java',
    boilerplate:
`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your solution below

    }
}
`,
  },
  {
    value: 'bash',
    label: 'Bash',
    monacoLanguage: 'shell',
    extension: 'sh',
    boilerplate:
`#!/bin/bash
# Bash script
read input

# Write your solution below
`,
  },
];

export const LANGUAGE_MAP = LANGUAGES.reduce((acc, lang) => {
  acc[lang.value] = lang;
  return acc;
}, {});

export const DEFAULT_LANGUAGE = 'python';
