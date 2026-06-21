// 4 hard_extra problems for the CodeShield-Engine question bank.
// Each problem includes a title, detailed description, difficulty/category
// tags, sample I/O, and 3-5 hidden test case vectors. Per-problem 'tags'
// arrays are enriched at seed time by seedData/tagMap.js (see seed.js).

module.exports = [
    {
        "title": "Course Schedule (Topological Sort Feasibility)",
        "description": "You are given an integer n (number of courses, labeled 0 to n-1) and a list of prerequisite pairs [a, b] meaning you must take course b before course a. Read n on the first line. Read m (number of prerequisite pairs) on the second line. Read m lines after that, each containing two space-separated integers a and b. Print 'true' if it is possible to finish all courses (i.e., there is no cycle in the dependency graph), otherwise print 'false'.",
        "difficulty": "Hard",
        "category": "Graphs",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "2\n1\n1 0",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "2\n1\n1 0",
                "expectedOutput": "true"
            },
            {
                "input": "2\n2\n1 0\n0 1",
                "expectedOutput": "false"
            },
            {
                "input": "4\n4\n1 0\n2 0\n3 1\n3 2",
                "expectedOutput": "true"
            },
            {
                "input": "3\n3\n0 1\n1 2\n2 0",
                "expectedOutput": "false"
            },
            {
                "input": "1\n0",
                "expectedOutput": "true"
            }
        ]
    },
    {
        "title": "Merge K Sorted Lists",
        "description": "You are given k sorted lists of integers. Read k on the first line. For each of the next k lines, the first number is the length of that list followed by its sorted elements (all space-separated). Merge all k lists into a single sorted list and print the resulting elements space-separated on one line. If the merged list is empty, print an empty line.",
        "difficulty": "Hard",
        "category": "Heaps",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "3\n2 1 4\n2 1 3\n2 2 6",
        "sampleOutput": "1 1 2 3 4 6",
        "testCases": [
            {
                "input": "3\n2 1 4\n2 1 3\n2 2 6",
                "expectedOutput": "1 1 2 3 4 6"
            },
            {
                "input": "1\n3 5 5 5",
                "expectedOutput": "5 5 5"
            },
            {
                "input": "0",
                "expectedOutput": ""
            },
            {
                "input": "2\n0\n0",
                "expectedOutput": ""
            },
            {
                "input": "4\n1 10\n1 -5\n1 0\n1 7",
                "expectedOutput": "-5 0 7 10"
            }
        ]
    },
    {
        "title": "Longest Consecutive Sequence",
        "description": "Given an unsorted array of integers, find the length of the longest run of consecutive integers (the integers do not need to be contiguous in the array, just consecutive in value, e.g. 1,2,3,4). Read n on the first line and n space-separated integers on the second line. Print a single integer: the length of the longest consecutive elements sequence. The expected solution runs in O(n) time.",
        "difficulty": "Hard",
        "category": "Arrays",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "6\n100 4 200 1 3 2",
        "sampleOutput": "4",
        "testCases": [
            {
                "input": "6\n100 4 200 1 3 2",
                "expectedOutput": "4"
            },
            {
                "input": "10\n0 3 7 2 5 8 4 6 0 1",
                "expectedOutput": "9"
            },
            {
                "input": "0\n",
                "expectedOutput": "0"
            },
            {
                "input": "1\n5",
                "expectedOutput": "1"
            },
            {
                "input": "5\n1 2 0 1 -1",
                "expectedOutput": "4"
            }
        ]
    },
    {
        "title": "Minimum Window Substring",
        "description": "Given two strings s and t, find the minimum length substring of s that contains all characters of t (including duplicates), in any order. Read s on the first line and t on the second line. Print the minimum window substring of s. If no such window exists, print an empty line. If multiple windows of the same minimum length exist, print the one that starts first (leftmost).",
        "difficulty": "Hard",
        "category": "Strings",
        "timeLimit": 2000,
        "memoryLimit": 256,
        "sampleInput": "ADOBECODEBANC\nABC",
        "sampleOutput": "BANC",
        "testCases": [
            {
                "input": "ADOBECODEBANC\nABC",
                "expectedOutput": "BANC"
            },
            {
                "input": "a\na",
                "expectedOutput": "a"
            },
            {
                "input": "a\naa",
                "expectedOutput": ""
            },
            {
                "input": "aa\naa",
                "expectedOutput": "aa"
            },
            {
                "input": "abcdebdde\nbde",
                "expectedOutput": "bdde"
            }
        ]
    }
];
