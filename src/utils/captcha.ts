export interface CaptchaChallenge {
  type: 'math' | 'pattern' | 'sequence' | 'logic';
  question: string;
  answer: string;
  options?: string[];
  description?: string;
}

export function generateCaptcha(): CaptchaChallenge {
  const types: CaptchaChallenge['type'][] = ['math', 'pattern', 'sequence', 'logic'];
  const type = types[Math.floor(Math.random() * types.length)];

  switch (type) {
    case 'math':
      return generateMathChallenge();
    case 'pattern':
      return generatePatternChallenge();
    case 'sequence':
      return generateSequenceChallenge();
    case 'logic':
      return generateLogicChallenge();
    default:
      return generateMathChallenge();
  }
}

function generateMathChallenge(): CaptchaChallenge {
  const operations = ['+', '-', '*'] as const;
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number;
  let num2: number;
  let answer: number;
  let question: string;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
  }

  return {
    type: 'math',
    question,
    answer: answer.toString(),
    description: 'Solve the math problem'
  };
}

function generatePatternChallenge(): CaptchaChallenge {
  const patterns = [
    {
      sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'],
      answer: '🔵',
      question: 'What comes next?'
    },
    {
      sequence: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'],
      answer: '⭐⭐⭐⭐⭐',
      question: 'What comes next?'
    },
    {
      sequence: ['🟥', '🟦', '🟦', '🟥', '🟦', '🟦'],
      answer: '🟥',
      question: 'What comes next?'
    },
    {
      sequence: ['▲', '▼', '▲', '▼', '▲'],
      answer: '▼',
      question: 'What comes next?'
    }
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  return {
    type: 'pattern',
    question: `${pattern.sequence.join(' ')} → ?`,
    answer: pattern.answer,
    description: pattern.question
  };
}

function generateSequenceChallenge(): CaptchaChallenge {
  const sequences = [
    {
      numbers: [2, 4, 6, 8],
      answer: 10,
      description: 'Continue the sequence'
    },
    {
      numbers: [1, 3, 5, 7],
      answer: 9,
      description: 'Continue the sequence'
    },
    {
      numbers: [5, 10, 15, 20],
      answer: 25,
      description: 'Continue the sequence'
    },
    {
      numbers: [1, 2, 4, 8],
      answer: 16,
      description: 'Continue the sequence'
    },
    {
      numbers: [10, 9, 8, 7],
      answer: 6,
      description: 'Continue the sequence'
    }
  ];

  const sequence = sequences[Math.floor(Math.random() * sequences.length)];
  
  return {
    type: 'sequence',
    question: `${sequence.numbers.join(', ')}, ?`,
    answer: sequence.answer.toString(),
    description: sequence.description
  };
}

function generateLogicChallenge(): CaptchaChallenge {
  const challenges = [
    {
      question: 'How many days in a week?',
      answer: '7'
    },
    {
      question: 'How many months in a year?',
      answer: '12'
    },
    {
      question: 'What is 10 ÷ 2?',
      answer: '5'
    },
    {
      question: 'How many sides does a triangle have?',
      answer: '3'
    },
    {
      question: 'What is 3² (3 squared)?',
      answer: '9'
    },
    {
      question: 'How many hours in a day?',
      answer: '24'
    },
    {
      question: 'How many legs does a spider have?',
      answer: '8'
    }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  
  return {
    type: 'logic',
    question: challenge.question,
    answer: challenge.answer,
    description: 'Answer the question'
  };
}

export function verifyCaptcha(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
}
