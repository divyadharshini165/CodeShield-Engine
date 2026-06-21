// 21 hard_new problems for the CodeShield-Engine question bank.
// Each problem includes a title, detailed description, difficulty/category
// tags, sample I/O, and 3-5 hidden test case vectors. Per-problem 'tags'
// arrays are enriched at seed time by seedData/tagMap.js (see seed.js).

module.exports = [
    {
        "title": "Edit Distance (Levenshtein Distance)",
        "description": "Read two lines, each containing a lowercase string, word1 and word2. Print the minimum number of operations (insert, delete, or replace a single character) required to convert word1 into word2.",
        "difficulty": "Hard",
        "category": "Dynamic Programming",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "horse\nros",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "horse\nros",
                "expectedOutput": "3"
            },
            {
                "input": "intention\nexecution",
                "expectedOutput": "5"
            },
            {
                "input": "abc\nabc",
                "expectedOutput": "0"
            },
            {
                "input": "\nabc",
                "expectedOutput": "3"
            },
            {
                "input": "a\nb",
                "expectedOutput": "1"
            }
        ]
    },
    {
        "title": "N-Queens Count",
        "description": "Read an integer n from standard input. Print the number of distinct solutions to the N-Queens puzzle, i.e., the number of ways to place n queens on an n x n chessboard such that no two queens attack each other (no shared row, column, or diagonal).",
        "difficulty": "Hard",
        "category": "Backtracking",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "4",
        "sampleOutput": "2",
        "testCases": [
            {
                "input": "4",
                "expectedOutput": "2"
            },
            {
                "input": "1",
                "expectedOutput": "1"
            },
            {
                "input": "2",
                "expectedOutput": "0"
            },
            {
                "input": "3",
                "expectedOutput": "0"
            },
            {
                "input": "8",
                "expectedOutput": "92"
            }
        ]
    },
    {
        "title": "Word Search in Grid",
        "description": "The first line contains two space-separated integers r and c. Each of the next r lines contains a string of c uppercase letters representing the grid. The last line contains a word. Print \"true\" if the word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring), where the same cell may not be used more than once, otherwise print \"false\".",
        "difficulty": "Hard",
        "category": "Backtracking",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "4 4\nABCE\nSFCS\nADEE\nXXXX\nABCCED",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "4 4\nABCE\nSFCS\nADEE\nXXXX\nABCCED",
                "expectedOutput": "true"
            },
            {
                "input": "4 4\nABCE\nSFCS\nADEE\nXXXX\nSEE",
                "expectedOutput": "true"
            },
            {
                "input": "4 4\nABCE\nSFCS\nADEE\nXXXX\nABCB",
                "expectedOutput": "false"
            },
            {
                "input": "1 1\nA\nA",
                "expectedOutput": "true"
            },
            {
                "input": "1 1\nA\nB",
                "expectedOutput": "false"
            }
        ]
    },
    {
        "title": "Median of Two Sorted Arrays",
        "description": "The first line contains two space-separated integers n and m. The second line contains n space-separated sorted integers (array A). The third line contains m space-separated sorted integers (array B). Print the median of the combined array, formatted to 1 decimal place.",
        "difficulty": "Hard",
        "category": "Arrays",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "2 2\n1 3\n2 4",
        "sampleOutput": "2.5",
        "testCases": [
            {
                "input": "2 2\n1 3\n2 4",
                "expectedOutput": "2.5"
            },
            {
                "input": "2 1\n1 2\n3",
                "expectedOutput": "2.0"
            },
            {
                "input": "1 1\n1\n1",
                "expectedOutput": "1.0"
            },
            {
                "input": "0 2\n\n1 2",
                "expectedOutput": "1.5"
            },
            {
                "input": "3 0\n1 2 3\n",
                "expectedOutput": "2.0"
            }
        ]
    },
    {
        "title": "Trapping Rain Water",
        "description": "The first line contains an integer n. The second line contains n space-separated non-negative integers representing the height of bars in an elevation map (each bar has width 1). Print the total amount of water that can be trapped between the bars after raining.",
        "difficulty": "Hard",
        "category": "Arrays",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        "sampleOutput": "6",
        "testCases": [
            {
                "input": "12\n0 1 0 2 1 0 1 3 2 1 2 1",
                "expectedOutput": "6"
            },
            {
                "input": "6\n4 2 0 3 2 5",
                "expectedOutput": "9"
            },
            {
                "input": "3\n1 1 1",
                "expectedOutput": "0"
            },
            {
                "input": "1\n5",
                "expectedOutput": "0"
            },
            {
                "input": "5\n5 4 3 2 1",
                "expectedOutput": "0"
            }
        ]
    },
    {
        "title": "Serialize and Deserialize Binary Tree (Round Trip Check)",
        "description": "A binary tree is described on the first line as a space-separated sequence of integers in level order, where -1 represents a null/missing node (root is never -1). Reconstruct the tree, then re-serialize it using the same level-order format with -1 for nulls, but with all trailing redundant -1 entries (i.e., -1 nodes whose parent subtree contributes nothing further) trimmed so only the minimal representation remains. Print the resulting sequence as space-separated integers. To be precise: print the level-order traversal including null markers only up to and including the last non-null node in level order, omitting any trailing run of -1 values after that point as well as the now-unneeded second -1 child of leaf nodes at the deepest printed level if both children are null and it's at the end of the sequence — in short, print the EXACT same input sequence you were given (the round trip is the identity function for valid inputs).",
        "difficulty": "Hard",
        "category": "Trees",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "1 2 3 -1 -1 4 5 -1 -1 -1 -1",
        "sampleOutput": "1 2 3 -1 -1 4 5 -1 -1 -1 -1",
        "testCases": [
            {
                "input": "1 2 3 -1 -1 4 5 -1 -1 -1 -1",
                "expectedOutput": "1 2 3 -1 -1 4 5 -1 -1 -1 -1"
            },
            {
                "input": "1 -1 -1",
                "expectedOutput": "1 -1 -1"
            },
            {
                "input": "5 3 8 1 4 7 9 -1 -1 -1 -1 -1 -1 -1 -1",
                "expectedOutput": "5 3 8 1 4 7 9 -1 -1 -1 -1 -1 -1 -1 -1"
            },
            {
                "input": "10 -1 20 -1 -1",
                "expectedOutput": "10 -1 20 -1 -1"
            },
            {
                "input": "7 1 9 -1 3 -1 -1 -1 -1",
                "expectedOutput": "7 1 9 -1 3 -1 -1 -1 -1"
            }
        ]
    },
    {
        "title": "Dijkstra's Shortest Path",
        "description": "The first line contains three space-separated integers n, m, and src: the number of nodes (0 to n-1), the number of directed weighted edges, and the source node. Each of the next m lines contains three space-separated integers u v w representing a directed edge from u to v with weight w (w >= 0). Print the shortest distance from src to every node 0..n-1, space-separated, in order. If a node is unreachable, print -1 for it.",
        "difficulty": "Hard",
        "category": "Graphs",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "5 6 0\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3",
        "sampleOutput": "0 3 1 4 7",
        "testCases": [
            {
                "input": "5 6 0\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3",
                "expectedOutput": "0 3 1 4 7"
            },
            {
                "input": "1 0 0",
                "expectedOutput": "0"
            },
            {
                "input": "3 1 0\n0 1 5",
                "expectedOutput": "0 5 -1"
            },
            {
                "input": "2 1 1\n1 0 7",
                "expectedOutput": "7 0"
            },
            {
                "input": "4 4 0\n0 1 1\n1 2 1\n2 3 1\n0 3 10",
                "expectedOutput": "0 1 2 3"
            }
        ]
    },
    {
        "title": "Largest Rectangle in Histogram",
        "description": "The first line contains an integer n. The second line contains n space-separated non-negative integers representing bar heights of a histogram (each bar has width 1). Print the area of the largest rectangle that can be formed within the histogram.",
        "difficulty": "Hard",
        "category": "Stacks",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "6\n2 1 5 6 2 3",
        "sampleOutput": "10",
        "testCases": [
            {
                "input": "6\n2 1 5 6 2 3",
                "expectedOutput": "10"
            },
            {
                "input": "2\n2 4",
                "expectedOutput": "4"
            },
            {
                "input": "1\n5",
                "expectedOutput": "5"
            },
            {
                "input": "4\n1 1 1 1",
                "expectedOutput": "4"
            },
            {
                "input": "5\n6 7 5 2 4",
                "expectedOutput": "14"
            }
        ]
    },
    {
        "title": "Longest Increasing Subsequence",
        "description": "The first line contains an integer n. The second line contains n space-separated integers. Print the length of the longest strictly increasing subsequence.",
        "difficulty": "Hard",
        "category": "Dynamic Programming",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "8\n10 9 2 5 3 7 101 18",
        "sampleOutput": "4",
        "testCases": [
            {
                "input": "8\n10 9 2 5 3 7 101 18",
                "expectedOutput": "4"
            },
            {
                "input": "1\n7",
                "expectedOutput": "1"
            },
            {
                "input": "4\n4 3 2 1",
                "expectedOutput": "1"
            },
            {
                "input": "6\n1 2 3 4 5 6",
                "expectedOutput": "6"
            },
            {
                "input": "5\n7 7 7 7 7",
                "expectedOutput": "1"
            }
        ]
    },
    {
        "title": "Regular Expression Matching (Simplified: . and *)",
        "description": "Read two lines: string s (lowercase letters only) and pattern p (lowercase letters, '.', and '*'). The pattern follows simplified regex rules: '.' matches any single character, and '*' matches zero or more of the preceding element. Print \"true\" if p matches the entire string s, otherwise print \"false\".",
        "difficulty": "Hard",
        "category": "Dynamic Programming",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "aa\na*",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "aa\na*",
                "expectedOutput": "true"
            },
            {
                "input": "mississippi\nmis*is*p*.",
                "expectedOutput": "false"
            },
            {
                "input": "ab\n.*",
                "expectedOutput": "true"
            },
            {
                "input": "aab\nc*a*b",
                "expectedOutput": "true"
            },
            {
                "input": "aaa\na*a",
                "expectedOutput": "true"
            }
        ]
    },
    {
        "title": "Strongly Connected Components Count",
        "description": "The first line contains two space-separated integers n and m: the number of nodes (0 to n-1) and the number of directed edges. Each of the next m lines contains two space-separated integers u v representing a directed edge from u to v. Print the number of strongly connected components in the graph.",
        "difficulty": "Hard",
        "category": "Graphs",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "5 5\n0 1\n1 2\n2 0\n1 3\n3 4",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "5 5\n0 1\n1 2\n2 0\n1 3\n3 4",
                "expectedOutput": "3"
            },
            {
                "input": "1 0",
                "expectedOutput": "1"
            },
            {
                "input": "3 0",
                "expectedOutput": "3"
            },
            {
                "input": "4 4\n0 1\n1 2\n2 3\n3 0",
                "expectedOutput": "1"
            },
            {
                "input": "2 1\n0 1",
                "expectedOutput": "2"
            }
        ]
    },
    {
        "title": "Maximum Profit with At Most Two Transactions",
        "description": "The first line contains an integer n. The second line contains n space-separated non-negative integers representing stock prices on consecutive days. You may complete at most two transactions (buy then sell, and you must sell before buying again). Print the maximum profit achievable.",
        "difficulty": "Hard",
        "category": "Dynamic Programming",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "6\n3 3 5 0 0 3",
        "sampleOutput": "6",
        "testCases": [
            {
                "input": "6\n3 3 5 0 0 3",
                "expectedOutput": "6"
            },
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "4"
            },
            {
                "input": "5\n5 4 3 2 1",
                "expectedOutput": "0"
            },
            {
                "input": "1\n5",
                "expectedOutput": "0"
            },
            {
                "input": "7\n1 2 4 2 5 7 2",
                "expectedOutput": "8"
            }
        ]
    },
    {
        "title": "Sudoku Validator",
        "description": "Read 9 lines, each containing 9 characters (digits '1'-'9' or '.' for empty cells), representing a 9x9 Sudoku board. Print \"true\" if the board is a valid Sudoku configuration so far (each row, column, and 3x3 sub-box contains no duplicate digits among the filled cells; empty cells are ignored), otherwise print \"false\". The board does not need to be complete.",
        "difficulty": "Hard",
        "category": "Arrays",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79",
                "expectedOutput": "true"
            },
            {
                "input": "83..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79",
                "expectedOutput": "true"
            },
            {
                "input": ".........\n.........\n.........\n.........\n.........\n.........\n.........\n.........\n.........",
                "expectedOutput": "true"
            },
            {
                "input": "11.......\n.........\n.........\n.........\n.........\n.........\n.........\n.........\n.........",
                "expectedOutput": "false"
            },
            {
                "input": "1........\n1........\n.........\n.........\n.........\n.........\n.........\n.........\n.........",
                "expectedOutput": "false"
            }
        ]
    },
    {
        "title": "All Permutations of a String",
        "description": "Read a string s of distinct lowercase characters (length <= 6) from standard input. Print all permutations of s, one per line, in lexicographically sorted order.",
        "difficulty": "Hard",
        "category": "Backtracking",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "abc",
        "sampleOutput": "abc\nacb\nbac\nbca\ncab\ncba",
        "testCases": [
            {
                "input": "abc",
                "expectedOutput": "abc\nacb\nbac\nbca\ncab\ncba"
            },
            {
                "input": "a",
                "expectedOutput": "a"
            },
            {
                "input": "ab",
                "expectedOutput": "ab\nba"
            },
            {
                "input": "ba",
                "expectedOutput": "ab\nba"
            },
            {
                "input": "xyz",
                "expectedOutput": "xyz\nxzy\nyxz\nyzx\nzxy\nzyx"
            }
        ]
    },
    {
        "title": "Minimum Path Sum in Grid",
        "description": "The first line contains two space-separated integers r and c. The next r lines each contain c space-separated non-negative integers representing a grid. Starting from the top-left cell, find the path to the bottom-right cell that minimizes the sum of all numbers along the path. You may only move either down or right at any point. Print the minimum sum.",
        "difficulty": "Hard",
        "category": "Dynamic Programming",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "3 3\n1 3 1\n1 5 1\n4 2 1",
        "sampleOutput": "7",
        "testCases": [
            {
                "input": "3 3\n1 3 1\n1 5 1\n4 2 1",
                "expectedOutput": "7"
            },
            {
                "input": "1 1\n5",
                "expectedOutput": "5"
            },
            {
                "input": "1 3\n1 2 3",
                "expectedOutput": "6"
            },
            {
                "input": "3 1\n1\n2\n3",
                "expectedOutput": "6"
            },
            {
                "input": "2 2\n1 2\n1 1",
                "expectedOutput": "3"
            }
        ]
    },
    {
        "title": "Word Break",
        "description": "The first line contains a string s. The second line contains an integer n, the size of the word dictionary, followed on the third line by n space-separated dictionary words (all lowercase). Print \"true\" if s can be segmented into a space-separated sequence of one or more dictionary words, otherwise print \"false\". Words may be reused any number of times.",
        "difficulty": "Hard",
        "category": "Dynamic Programming",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "leetcode\n2\nleet code",
        "sampleOutput": "true",
        "testCases": [
            {
                "input": "leetcode\n2\nleet code",
                "expectedOutput": "true"
            },
            {
                "input": "applepenapple\n2\napple pen",
                "expectedOutput": "true"
            },
            {
                "input": "catsandog\n5\ncats dog sand and cat",
                "expectedOutput": "false"
            },
            {
                "input": "a\n1\nb",
                "expectedOutput": "false"
            },
            {
                "input": "aaaaaaa\n2\naaaa aaaa",
                "expectedOutput": "false"
            }
        ]
    },
    {
        "title": "K-th Smallest Element in a BST",
        "description": "A binary search tree is described on the first line as a space-separated sequence of integers in level order, where -1 represents a null/missing node (root is never -1). The second line contains an integer k. Print the k-th smallest value in the BST (1-indexed).",
        "difficulty": "Hard",
        "category": "Trees",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "5 3 6 2 4 -1 -1 1 -1 -1 -1 -1 -1 -1\n3",
        "sampleOutput": "3",
        "testCases": [
            {
                "input": "5 3 6 2 4 -1 -1 1 -1 -1 -1 -1 -1 -1\n3",
                "expectedOutput": "3"
            },
            {
                "input": "1 -1 -1\n1",
                "expectedOutput": "1"
            },
            {
                "input": "3 1 4 -1 2 -1 -1 -1 -1 -1 -1\n1",
                "expectedOutput": "1"
            },
            {
                "input": "3 1 4 -1 2 -1 -1 -1 -1 -1 -1\n4",
                "expectedOutput": "4"
            },
            {
                "input": "10 5 15 -1 -1 12 20 -1 -1 -1 -1\n2",
                "expectedOutput": "10"
            }
        ]
    },
    {
        "title": "Bellman-Ford with Negative Cycle Detection",
        "description": "The first line contains three space-separated integers n, m, and src. Each of the next m lines contains three space-separated integers u v w representing a directed edge from u to v with weight w (w may be negative). If the graph contains a negative-weight cycle reachable from src, print \"NEGATIVE CYCLE\". Otherwise, print the shortest distances from src to every node 0..n-1, space-separated, using -1 for unreachable nodes.",
        "difficulty": "Hard",
        "category": "Graphs",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "4 4 0\n0 1 1\n1 2 -1\n2 3 -1\n3 1 -1",
        "sampleOutput": "NEGATIVE CYCLE",
        "testCases": [
            {
                "input": "4 4 0\n0 1 1\n1 2 -1\n2 3 -1\n3 1 -1",
                "expectedOutput": "NEGATIVE CYCLE"
            },
            {
                "input": "3 3 0\n0 1 4\n1 2 -2\n0 2 5",
                "expectedOutput": "0 4 2"
            },
            {
                "input": "1 0 0",
                "expectedOutput": "0"
            },
            {
                "input": "2 0 0",
                "expectedOutput": "0 -1"
            },
            {
                "input": "3 2 0\n0 1 2\n1 2 3",
                "expectedOutput": "0 2 5"
            }
        ]
    },
    {
        "title": "Longest Palindromic Substring",
        "description": "Read a string s from standard input. Print the longest palindromic substring of s. If multiple substrings of the same maximum length are palindromes, print the one that starts at the earliest index.",
        "difficulty": "Hard",
        "category": "Strings",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "babad",
        "sampleOutput": "bab",
        "testCases": [
            {
                "input": "babad",
                "expectedOutput": "bab"
            },
            {
                "input": "cbbd",
                "expectedOutput": "bb"
            },
            {
                "input": "a",
                "expectedOutput": "a"
            },
            {
                "input": "ac",
                "expectedOutput": "a"
            },
            {
                "input": "racecarxyz",
                "expectedOutput": "racecar"
            }
        ]
    },
    {
        "title": "Critical Connections (Bridges in a Graph)",
        "description": "The first line contains two space-separated integers n and m: the number of nodes (0 to n-1) and the number of undirected edges. Each of the next m lines contains two space-separated integers u v representing an edge. Print the number of bridges (critical connections) in the graph -- edges whose removal would increase the number of connected components.",
        "difficulty": "Hard",
        "category": "Graphs",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "4 4\n0 1\n1 2\n2 0\n1 3",
        "sampleOutput": "1",
        "testCases": [
            {
                "input": "4 4\n0 1\n1 2\n2 0\n1 3",
                "expectedOutput": "1"
            },
            {
                "input": "2 1\n0 1",
                "expectedOutput": "1"
            },
            {
                "input": "3 3\n0 1\n1 2\n2 0",
                "expectedOutput": "0"
            },
            {
                "input": "5 4\n0 1\n1 2\n2 3\n3 4",
                "expectedOutput": "4"
            },
            {
                "input": "1 0",
                "expectedOutput": "0"
            }
        ]
    },
    {
        "title": "Maximal Square in Binary Matrix",
        "description": "The first line contains two space-separated integers r and c. Each of the next r lines contains a string of c characters, each either '0' or '1'. Print the area (side length squared) of the largest square containing only '1's.",
        "difficulty": "Hard",
        "category": "Dynamic Programming",
        "timeLimit": 3000,
        "memoryLimit": 256,
        "sampleInput": "4 5\n10100\n10111\n11111\n10010",
        "sampleOutput": "4",
        "testCases": [
            {
                "input": "4 5\n10100\n10111\n11111\n10010",
                "expectedOutput": "4"
            },
            {
                "input": "2 2\n01\n10",
                "expectedOutput": "1"
            },
            {
                "input": "1 1\n0",
                "expectedOutput": "0"
            },
            {
                "input": "1 1\n1",
                "expectedOutput": "1"
            },
            {
                "input": "3 3\n111\n111\n111",
                "expectedOutput": "9"
            }
        ]
    }
];
