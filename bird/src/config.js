const config = {
  debugEnabled: true,
  control: {
    paused: {
      _comment : 'paused',
      value : 0,
      min : 0,
      max : 1,
    },
    fps: {
      _comment : 'fps',
      value : 30,
      min : 0,
      max : 60,
    },
    pipe_gap_vertical: {
      _comment : 'pipe_gap_vertical',
      value : 150,
      min : 0,
      max : 300,
    },
    pipe_gap_horizontal: {
      _comment : 'pipe_gap_horizontal',
      value : 200,
      min : 0,
      max : 300,
    },
    pipe_speed: {
      _comment : 'pipe_speed',
      value : 5,
      min : 0,
      max : 10,
    },
    score: {
      _comment : 'score',
      value : 0,
      min : 0,
      max : 9999,
    },
    invincible: {
      _comment : 'invincible',
      value : 0,
      min : 0,
      max : 1,
    },
  }
}
