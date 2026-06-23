// 40 easy problems for the CodeShield-Engine question bank.
// Each problem includes a title, detailed description, difficulty/category
// tags, sample I/O, and 3-5 hidden test case vectors. Per-problem 'tags'
// arrays are enriched at seed time by seedData/tagMap.js (see seed.js).

module.exports = [
    {
        "title": "Reverse a String",
        "description": "Given a string s read from standard input, print the reverse of the string. The string may contain spaces and punctuation. Do not strip whitespace.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "hello",
        "sampleOutput": "olleh",
        "testCases": [
            {
                "input": "hello",
                "expectedOutput": "olleh"
            },
            {
                "input": "world",
                "expectedOutput": "dlrow"
            },
            {
                "input": "a",
                "expectedOutput": "a"
            },
            {
                "input": "Coding Judge",
                "expectedOutput": "egduJ gnidoC"
            },
            {
                "input": "12345",
                "expectedOutput": "54321"
            }
        ]
    },
    {
        "title": "Sum of Two Integers",
        "description": "Read two space-separated integers a and b from a single line of standard input, and print their sum.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "3 5",
        "sampleOutput": "8",
        "testCases": [
            {
                "input": "3 5",
                "expectedOutput": "8"
            },
            {
                "input": "-2 7",
                "expectedOutput": "5"
            },
            {
                "input": "0 0",
                "expectedOutput": "0"
            },
            {
                "input": "100 200",
                "expectedOutput": "300"
            },
            {
                "input": "-10 -20",
                "expectedOutput": "-30"
            }
        ]
    },
    {
        "title": "Check Even or Odd",
        "description": "Read a single integer n from standard input. Print \"Even\" if n is divisible by 2, otherwise print \"Odd\".",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "7",
        "sampleOutput": "Odd",
        "testCases": [
            {
                "input": "7",
                "expectedOutput": "Odd"
            },
            {
                "input": "8",
                "expectedOutput": "Even"
            },
            {
                "input": "0",
                "expectedOutput": "Even"
            },
            {
                "input": "-3",
                "expectedOutput": "Odd"
            },
            {
                "input": "100",
                "expectedOutput": "Even"
            }
        ]
    },
    {
        "title": "Find the Maximum of Three Numbers",
        "description": "Read three space-separated integers from standard input and print the maximum value among them.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "3 7 2",
        "sampleOutput": "7",
        "testCases": [
            {
                "input": "3 7 2",
                "expectedOutput": "7"
            },
            {
                "input": "-1 -5 -2",
                "expectedOutput": "-1"
            },
            {
                "input": "10 10 10",
                "expectedOutput": "10"
            },
            {
                "input": "0 -3 5",
                "expectedOutput": "5"
            },
            {
                "input": "99 100 98",
                "expectedOutput": "100"
            }
        ]
    },
    {
        "title": "Factorial of a Number",
        "description": "Read a non-negative integer n from standard input and print n! (n factorial). Note that 0! = 1.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5",
        "sampleOutput": "120",
        "testCases": [
            {
                "input": "5",
                "expectedOutput": "120"
            },
            {
                "input": "0",
                "expectedOutput": "1"
            },
            {
                "input": "1",
                "expectedOutput": "1"
            },
            {
                "input": "10",
                "expectedOutput": "3628800"
            },
            {
                "input": "6",
                "expectedOutput": "720"
            }
        ]
    },
    {
        "title": "Palindrome Check",
        "description": "Read a string from standard input and print \"true\" if it is a palindrome (reads the same forwards and backwards), otherwise print \"false\". Comparison is case-sensitive and exact (no trimming of non-alphanumeric characters).",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "racecar",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "racecar",
                "expectedOutput": "true"
            },
            {
                "input": "hello",
                "expectedOutput": "false"
            },
            {
                "input": "a",
                "expectedOutput": "true"
            },
            {
                "input": "abba",
                "expectedOutput": "true"
            },
            {
                "input": "abcd",
                "expectedOutput": "false"
            }
        ]
    },
    {
        "title": "Count Vowels in a String",
        "description": "Read a lowercase string from standard input and print the total count of vowels (a, e, i, o, u) present in it.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "leetcode",
        "sampleOutput": "4",
        "testCases": [
            {
                "input": "leetcode",
                "expectedOutput": "4"
            },
            {
                "input": "xyz",
                "expectedOutput": "0"
            },
            {
                "input": "aeiou",
                "expectedOutput": "5"
            },
            {
                "input": "programming",
                "expectedOutput": "3"
            },
            {
                "input": "a",
                "expectedOutput": "1"
            }
        ]
    },
    {
        "title": "Fibonacci Sequence Term",
        "description": "Read an integer n (0-indexed) from standard input and print the n-th term of the Fibonacci sequence, where F(0)=0, F(1)=1, and F(n)=F(n-1)+F(n-2).",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "6",
        "sampleOutput": "8",
        "testCases": [
            {
                "input": "6",
                "expectedOutput": "8"
            },
            {
                "input": "0",
                "expectedOutput": "0"
            },
            {
                "input": "1",
                "expectedOutput": "1"
            },
            {
                "input": "10",
                "expectedOutput": "55"
            },
            {
                "input": "15",
                "expectedOutput": "610"
            }
        ]
    },
    {
        "title": "Array Sum",
        "description": "The first line contains an integer n, the number of elements. The second line contains n space-separated integers. Print the sum of all elements.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5\n1 2 3 4 5",
        "sampleOutput": "15",
        "testCases": [
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "15"
            },
            {
                "input": "3\n-1 -2 -3",
                "expectedOutput": "-6"
            },
            {
                "input": "1\n100",
                "expectedOutput": "100"
            },
            {
                "input": "4\n0 0 0 0",
                "expectedOutput": "0"
            },
            {
                "input": "6\n10 20 30 -5 -5 0",
                "expectedOutput": "50"
            }
        ]
    },
    {
        "title": "Find the Minimum in an Array",
        "description": "The first line contains an integer n, the number of elements. The second line contains n space-separated integers. Print the minimum value in the array.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5\n4 2 9 1 7",
        "sampleOutput": "1",
        "testCases": [
            {
                "input": "5\n4 2 9 1 7",
                "expectedOutput": "1"
            },
            {
                "input": "3\n-5 -1 -10",
                "expectedOutput": "-10"
            },
            {
                "input": "1\n42",
                "expectedOutput": "42"
            },
            {
                "input": "4\n0 -2 5 3",
                "expectedOutput": "-2"
            },
            {
                "input": "6\n100 99 98 97 96 95",
                "expectedOutput": "95"
            }
        ]
    },
    {
        "title": "Linear Search",
        "description": "The first line contains an integer n. The second line contains n space-separated integers (the array). The third line contains an integer target. Print the index (0-based) of target in the array, or -1 if it is not present.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5\n10 20 30 40 50\n30",
        "sampleOutput": "2",
        "testCases": [
            {
                "input": "5\n10 20 30 40 50\n30",
                "expectedOutput": "2"
            },
            {
                "input": "5\n10 20 30 40 50\n100",
                "expectedOutput": "-1"
            },
            {
                "input": "1\n7\n7",
                "expectedOutput": "0"
            },
            {
                "input": "4\n1 2 3 4\n4",
                "expectedOutput": "3"
            },
            {
                "input": "3\n5 5 5\n5",
                "expectedOutput": "0"
            }
        ]
    },
    {
        "title": "Count Occurrences of a Character",
        "description": "The first line contains a string s. The second line contains a single character c. Print the number of times c appears in s.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "banana\na",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "banana\na",
                "expectedOutput": "3"
            },
            {
                "input": "hello\nl",
                "expectedOutput": "2"
            },
            {
                "input": "mississippi\ns",
                "expectedOutput": "4"
            },
            {
                "input": "xyz\na",
                "expectedOutput": "0"
            },
            {
                "input": "aaaaaa\na",
                "expectedOutput": "6"
            }
        ]
    },
    {
        "title": "Power of a Number",
        "description": "Read two space-separated integers base and exponent from standard input, where exponent is non-negative. Print base raised to the power exponent.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "2 10",
        "sampleOutput": "1024",
        "testCases": [
            {
                "input": "2 10",
                "expectedOutput": "1024"
            },
            {
                "input": "3 0",
                "expectedOutput": "1"
            },
            {
                "input": "5 3",
                "expectedOutput": "125"
            },
            {
                "input": "1 100",
                "expectedOutput": "1"
            },
            {
                "input": "-2 3",
                "expectedOutput": "-8"
            }
        ]
    },
    {
        "title": "GCD of Two Numbers",
        "description": "Read two space-separated positive integers a and b from standard input and print their Greatest Common Divisor (GCD).",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "12 18",
        "sampleOutput": "6",
        "testCases": [
            {
                "input": "12 18",
                "expectedOutput": "6"
            },
            {
                "input": "7 13",
                "expectedOutput": "1"
            },
            {
                "input": "100 75",
                "expectedOutput": "25"
            },
            {
                "input": "8 8",
                "expectedOutput": "8"
            },
            {
                "input": "1000000 500000",
                "expectedOutput": "500000"
            }
        ]
    },
    {
        "title": "Check Prime Number",
        "description": "Read a positive integer n from standard input. Print \"Prime\" if n is a prime number, otherwise print \"Not Prime\". Note: 1 is not a prime number.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "7",
        "sampleOutput": "Prime",
        "testCases": [
            {
                "input": "7",
                "expectedOutput": "Prime"
            },
            {
                "input": "1",
                "expectedOutput": "Not Prime"
            },
            {
                "input": "4",
                "expectedOutput": "Not Prime"
            },
            {
                "input": "2",
                "expectedOutput": "Prime"
            },
            {
                "input": "97",
                "expectedOutput": "Prime"
            }
        ]
    },
    {
        "title": "Sum of Digits",
        "description": "Read a non-negative integer n from standard input and print the sum of its individual digits.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "12345",
        "sampleOutput": "15",
        "testCases": [
            {
                "input": "12345",
                "expectedOutput": "15"
            },
            {
                "input": "0",
                "expectedOutput": "0"
            },
            {
                "input": "9",
                "expectedOutput": "9"
            },
            {
                "input": "1000",
                "expectedOutput": "1"
            },
            {
                "input": "987654321",
                "expectedOutput": "45"
            }
        ]
    },
    {
        "title": "Reverse an Integer",
        "description": "Read an integer n from standard input (n may be negative) and print the integer with its digits reversed. The sign should be preserved, and there should be no leading zeros in the output (other than the number 0 itself).",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "1234",
        "sampleOutput": "4321",
        "testCases": [
            {
                "input": "1234",
                "expectedOutput": "4321"
            },
            {
                "input": "-456",
                "expectedOutput": "-654"
            },
            {
                "input": "100",
                "expectedOutput": "1"
            },
            {
                "input": "0",
                "expectedOutput": "0"
            },
            {
                "input": "7",
                "expectedOutput": "7"
            }
        ]
    },
    {
        "title": "Count Words in a Sentence",
        "description": "Read a single line of text from standard input and print the number of words in it. Words are separated by one or more spaces.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "The quick brown fox",
        "sampleOutput": "4",
        "testCases": [
            {
                "input": "The quick brown fox",
                "expectedOutput": "4"
            },
            {
                "input": "Hello",
                "expectedOutput": "1"
            },
            {
                "input": "one  two   three",
                "expectedOutput": "3"
            },
            {
                "input": "a b c d e",
                "expectedOutput": "5"
            },
            {
                "input": "single",
                "expectedOutput": "1"
            }
        ]
    },
    {
        "title": "Convert to Uppercase",
        "description": "Read a line of text from standard input and print it converted entirely to uppercase letters.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "hello world",
        "sampleOutput": "HELLO WORLD",
        "testCases": [
            {
                "input": "hello world",
                "expectedOutput": "HELLO WORLD"
            },
            {
                "input": "Already UPPER",
                "expectedOutput": "ALREADY UPPER"
            },
            {
                "input": "12345",
                "expectedOutput": "12345"
            },
            {
                "input": "MixedCase123",
                "expectedOutput": "MIXEDCASE123"
            },
            {
                "input": "a",
                "expectedOutput": "A"
            }
        ]
    },
    {
        "title": "Find Second Largest Element",
        "description": "The first line contains an integer n (n >= 2). The second line contains n space-separated distinct integers. Print the second largest element in the array.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5\n10 20 4 45 99",
        "sampleOutput": "45",
        "testCases": [
            {
                "input": "5\n10 20 4 45 99",
                "expectedOutput": "45"
            },
            {
                "input": "2\n1 2",
                "expectedOutput": "1"
            },
            {
                "input": "4\n-1 -2 -3 -4",
                "expectedOutput": "-2"
            },
            {
                "input": "3\n100 50 75",
                "expectedOutput": "75"
            },
            {
                "input": "6\n5 1 4 2 3 6",
                "expectedOutput": "5"
            }
        ]
    },
    {
        "title": "Swap Two Numbers",
        "description": "Read two space-separated integers a and b from standard input. Print them swapped (b first, then a), separated by a space.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5 10",
        "sampleOutput": "10 5",
        "testCases": [
            {
                "input": "5 10",
                "expectedOutput": "10 5"
            },
            {
                "input": "-1 1",
                "expectedOutput": "1 -1"
            },
            {
                "input": "0 0",
                "expectedOutput": "0 0"
            },
            {
                "input": "100 -100",
                "expectedOutput": "-100 100"
            },
            {
                "input": "7 3",
                "expectedOutput": "3 7"
            }
        ]
    },
    {
        "title": "Check Anagram",
        "description": "The first line contains string s1 and the second line contains string s2 (both lowercase, no spaces). Print \"true\" if s2 is an anagram of s1 (same characters, same frequency, possibly different order), otherwise print \"false\".",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "listen\nsilent",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "listen\nsilent",
                "expectedOutput": "true"
            },
            {
                "input": "hello\nworld",
                "expectedOutput": "false"
            },
            {
                "input": "abc\ncba",
                "expectedOutput": "true"
            },
            {
                "input": "aab\nabb",
                "expectedOutput": "false"
            },
            {
                "input": "a\na",
                "expectedOutput": "true"
            }
        ]
    },
    {
        "title": "Print Multiplication Table",
        "description": "Read an integer n from standard input and print its multiplication table from 1 to 10, one line per entry in the format \"n x i = result\" (e.g., \"5 x 1 = 5\"). Each entry is on its own line.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "2",
        "sampleOutput": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20",
        "testCases": [
            {
                "input": "2",
                "expectedOutput": "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20"
            },
            {
                "input": "1",
                "expectedOutput": "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10"
            },
            {
                "input": "0",
                "expectedOutput": "0 x 1 = 0\n0 x 2 = 0\n0 x 3 = 0\n0 x 4 = 0\n0 x 5 = 0\n0 x 6 = 0\n0 x 7 = 0\n0 x 8 = 0\n0 x 9 = 0\n0 x 10 = 0"
            }
        ]
    },
    {
        "title": "Remove Duplicates from Sorted Array",
        "description": "The first line contains an integer n. The second line contains n space-separated integers, sorted in non-decreasing order. Print the distinct elements in order, separated by spaces, with duplicates removed.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "7\n1 1 2 2 3 4 4",
        "sampleOutput": "1 2 3 4",
        "testCases": [
            {
                "input": "7\n1 1 2 2 3 4 4",
                "expectedOutput": "1 2 3 4"
            },
            {
                "input": "5\n1 1 1 1 1",
                "expectedOutput": "1"
            },
            {
                "input": "4\n1 2 3 4",
                "expectedOutput": "1 2 3 4"
            },
            {
                "input": "1\n5",
                "expectedOutput": "5"
            },
            {
                "input": "6\n-3 -3 -1 0 0 2",
                "expectedOutput": "-3 -1 0 2"
            }
        ]
    },
    {
        "title": "Temperature Converter (Celsius to Fahrenheit)",
        "description": "Read a floating point number representing a temperature in degrees Celsius. Print the equivalent temperature in degrees Fahrenheit, rounded to 2 decimal places, using the formula F = C * 9/5 + 32.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "0",
        "sampleOutput": "32.00",
        "testCases": [
            {
                "input": "0",
                "expectedOutput": "32.00"
            },
            {
                "input": "100",
                "expectedOutput": "212.00"
            },
            {
                "input": "37",
                "expectedOutput": "98.60"
            },
            {
                "input": "-40",
                "expectedOutput": "-40.00"
            },
            {
                "input": "25",
                "expectedOutput": "77.00"
            }
        ]
    },
    {
        "title": "Leap Year Checker",
        "description": "Read an integer year from standard input. Print \"Leap Year\" if it is a leap year, otherwise print \"Not a Leap Year\". A year is a leap year if divisible by 4, except centuries (divisible by 100) which must also be divisible by 400.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "2024",
        "sampleOutput": "Leap Year",
        "testCases": [
            {
                "input": "2024",
                "expectedOutput": "Leap Year"
            },
            {
                "input": "2023",
                "expectedOutput": "Not a Leap Year"
            },
            {
                "input": "1900",
                "expectedOutput": "Not a Leap Year"
            },
            {
                "input": "2000",
                "expectedOutput": "Leap Year"
            },
            {
                "input": "2100",
                "expectedOutput": "Not a Leap Year"
            }
        ]
    },
    {
        "title": "ASCII Value of a Character",
        "description": "Read a single character from standard input and print its ASCII (decimal) value.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "A",
        "sampleOutput": "65",
        "testCases": [
            {
                "input": "A",
                "expectedOutput": "65"
            },
            {
                "input": "a",
                "expectedOutput": "97"
            },
            {
                "input": "0",
                "expectedOutput": "48"
            },
            {
                "input": " ",
                "expectedOutput": "32"
            },
            {
                "input": "Z",
                "expectedOutput": "90"
            }
        ]
    },
    {
        "title": "Array Average",
        "description": "The first line contains an integer n. The second line contains n space-separated integers. Print the average of these numbers rounded to 2 decimal places.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "4\n1 2 3 4",
        "sampleOutput": "2.50",
        "testCases": [
            {
                "input": "4\n1 2 3 4",
                "expectedOutput": "2.50"
            },
            {
                "input": "3\n10 20 30",
                "expectedOutput": "20.00"
            },
            {
                "input": "1\n7",
                "expectedOutput": "7.00"
            },
            {
                "input": "5\n1 1 1 1 1",
                "expectedOutput": "1.00"
            },
            {
                "input": "2\n-2 2",
                "expectedOutput": "0.00"
            }
        ]
    },
    {
        "title": "Binary to Decimal Conversion",
        "description": "Read a string representing a binary number (containing only 0s and 1s) from standard input and print its decimal (base-10) equivalent.",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "1010",
        "sampleOutput": "10",
        "testCases": [
            {
                "input": "1010",
                "expectedOutput": "10"
            },
            {
                "input": "1111",
                "expectedOutput": "15"
            },
            {
                "input": "0",
                "expectedOutput": "0"
            },
            {
                "input": "1",
                "expectedOutput": "1"
            },
            {
                "input": "100000",
                "expectedOutput": "32"
            }
        ]
    },
    {
        "title": "Decimal to Binary Conversion",
        "description": "Read a non-negative integer n from standard input and print its binary representation (without leading zeros, except for the number 0 itself which should print as \"0\").",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "10",
        "sampleOutput": "1010",
        "testCases": [
            {
                "input": "10",
                "expectedOutput": "1010"
            },
            {
                "input": "0",
                "expectedOutput": "0"
            },
            {
                "input": "1",
                "expectedOutput": "1"
            },
            {
                "input": "255",
                "expectedOutput": "11111111"
            },
            {
                "input": "32",
                "expectedOutput": "100000"
            }
        ]
    },
    {
        "title": "Check if Array is Sorted",
        "description": "The first line contains an integer n. The second line contains n space-separated integers. Print \"true\" if the array is sorted in non-decreasing order, otherwise print \"false\".",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5\n1 2 3 4 5",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "true"
            },
            {
                "input": "5\n5 4 3 2 1",
                "expectedOutput": "false"
            },
            {
                "input": "1\n1",
                "expectedOutput": "true"
            },
            {
                "input": "4\n1 1 2 2",
                "expectedOutput": "true"
            },
            {
                "input": "3\n1 3 2",
                "expectedOutput": "false"
            }
        ]
    },
    {
        "title": "Sum of Even Numbers in a Range",
        "description": "Read two space-separated integers a and b (a <= b) from standard input and print the sum of all even numbers in the inclusive range [a, b].",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "1 10",
        "sampleOutput": "30",
        "testCases": [
            {
                "input": "1 10",
                "expectedOutput": "30"
            },
            {
                "input": "2 2",
                "expectedOutput": "2"
            },
            {
                "input": "3 3",
                "expectedOutput": "0"
            },
            {
                "input": "0 5",
                "expectedOutput": "6"
            },
            {
                "input": "-4 4",
                "expectedOutput": "0"
            }
        ]
    },
    {
        "title": "First Non-Repeating Character",
        "description": "Read a lowercase string from standard input and print the first character that does not repeat anywhere else in the string. If every character repeats, print \"None\".",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "swiss",
        "sampleOutput": "w",
        "testCases": [
            {
                "input": "swiss",
                "expectedOutput": "w"
            },
            {
                "input": "aabbcc",
                "expectedOutput": "None"
            },
            {
                "input": "a",
                "expectedOutput": "a"
            },
            {
                "input": "aabbc",
                "expectedOutput": "c"
            },
            {
                "input": "teeter",
                "expectedOutput": "r"
            }
        ]
    },
    {
        "title": "Armstrong Number Check",
        "description": "Read a positive integer n from standard input. Print \"Armstrong\" if n is an Armstrong number (the sum of its digits each raised to the power of the number of digits equals n itself), otherwise print \"Not Armstrong\".",
        "difficulty": "Easy",
        "category": "Math",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "153",
        "sampleOutput": "Armstrong",
        "testCases": [
            {
                "input": "153",
                "expectedOutput": "Armstrong"
            },
            {
                "input": "123",
                "expectedOutput": "Not Armstrong"
            },
            {
                "input": "9474",
                "expectedOutput": "Armstrong"
            },
            {
                "input": "9475",
                "expectedOutput": "Not Armstrong"
            },
            {
                "input": "5",
                "expectedOutput": "Armstrong"
            }
        ]
    },
    {
        "title": "Print a Right Triangle of Stars",
        "description": "Read an integer n from standard input and print a right-aligned triangle pattern of asterisks (*) with n rows, where row i (1-indexed) contains i asterisks with no trailing spaces.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "3",
        "sampleOutput": "*\n**\n***",
        "testCases": [
            {
                "input": "3",
                "expectedOutput": "*\n**\n***"
            },
            {
                "input": "1",
                "expectedOutput": "*"
            },
            {
                "input": "5",
                "expectedOutput": "*\n**\n***\n****\n*****"
            }
        ]
    },
    {
        "title": "Find Missing Number",
        "description": "The first line contains an integer n. The second line contains n-1 distinct space-separated integers, each between 1 and n inclusive. Exactly one number from 1 to n is missing. Print the missing number.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5\n1 2 4 5",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "5\n1 2 4 5",
                "expectedOutput": "3"
            },
            {
                "input": "3\n2 3",
                "expectedOutput": "1"
            },
            {
                "input": "3\n1 2",
                "expectedOutput": "3"
            },
            {
                "input": "1\n",
                "expectedOutput": "1"
            },
            {
                "input": "6\n1 2 3 4 6",
                "expectedOutput": "5"
            }
        ]
    },
    {
        "title": "Rotate Array to the Right",
        "description": "The first line contains two space-separated integers n and k. The second line contains n space-separated integers. Rotate the array to the right by k steps and print the result as space-separated integers.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "5 2\n1 2 3 4 5",
        "sampleOutput": "4 5 1 2 3",
        "testCases": [
            {
                "input": "5 2\n1 2 3 4 5",
                "expectedOutput": "4 5 1 2 3"
            },
            {
                "input": "4 1\n1 2 3 4",
                "expectedOutput": "4 1 2 3"
            },
            {
                "input": "3 3\n1 2 3",
                "expectedOutput": "1 2 3"
            },
            {
                "input": "3 4\n1 2 3",
                "expectedOutput": "3 1 2"
            },
            {
                "input": "1 5\n9",
                "expectedOutput": "9"
            }
        ]
    },
    {
        "title": "Title Case a Sentence",
        "description": "Read a line of lowercase words separated by single spaces from standard input. Print the sentence with the first letter of each word capitalized.",
        "difficulty": "Easy",
        "category": "Strings",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "the quick brown fox",
        "sampleOutput": "The Quick Brown Fox",
        "testCases": [
            {
                "input": "the quick brown fox",
                "expectedOutput": "The Quick Brown Fox"
            },
            {
                "input": "hello",
                "expectedOutput": "Hello"
            },
            {
                "input": "a b c",
                "expectedOutput": "A B C"
            },
            {
                "input": "data structures and algorithms",
                "expectedOutput": "Data Structures And Algorithms"
            },
            {
                "input": "x",
                "expectedOutput": "X"
            }
        ]
    },
    {
        "title": "Sum of Array Squares",
        "description": "The first line contains an integer n. The second line contains n space-separated integers. Print the sum of the squares of all elements.",
        "difficulty": "Easy",
        "category": "Arrays",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "3\n1 2 3",
        "sampleOutput": "14",
        "testCases": [
            {
                "input": "3\n1 2 3",
                "expectedOutput": "14"
            },
            {
                "input": "1\n5",
                "expectedOutput": "25"
            },
            {
                "input": "4\n0 0 0 0",
                "expectedOutput": "0"
            },
            {
                "input": "2\n-2 2",
                "expectedOutput": "8"
            },
            {
                "input": "5\n1 1 1 1 1",
                "expectedOutput": "5"
            }
        ]
    },
    {
        "title": "Valid Parentheses (Single Type)",
        "description": "Read a string consisting only of '(' and ')' characters. Print \"true\" if the parentheses are balanced (every opening bracket has a matching closing bracket in the correct order), otherwise print \"false\".",
        "difficulty": "Easy",
        "category": "Stacks",
        "timeLimit": 1000,
        "memoryLimit": 128,
        "sampleInput": "(())",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "(())",
                "expectedOutput": "true"
            },
            {
                "input": "(()",
                "expectedOutput": "false"
            },
            {
                "input": "()()",
                "expectedOutput": "true"
            },
            {
                "input": ")(",
                "expectedOutput": "false"
            },
            {
                "input": " ",
                "expectedOutput": "true"
            }
        ]
    }
];
