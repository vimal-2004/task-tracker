import './App.css'
import './animations.css'
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getTeams, createTeam, joinTeam, getTasks, createTask, updateTask, deleteTask } from './api'
import { AppBar, Toolbar, Typography, Button, Box, Container, Paper, TextField, Grid, Card, CardContent, CardActions, Alert, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return (
    <Box minHeight="100vh" bgcolor="#f5f6fa" className="fade-in">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Team Task Tracker</Typography>
          {user ? <Button color="inherit" component={RouterLink} to="/dashboard" className="animated-btn">Dashboard</Button> : <>
            <Button color="inherit" component={RouterLink} to="/login" className="animated-btn">Login</Button>
            <Button color="inherit" component={RouterLink} to="/register" className="animated-btn">Register</Button>
          </>}
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>Team Task Tracker</Typography>
          <Typography variant="h6" gutterBottom>Collaborate with your team, assign tasks, and track progress efficiently.</Typography>
          <Box mt={4}>
            {user ? <Button variant="contained" size="large" component={RouterLink} to="/dashboard" className="animated-btn">Go to Dashboard</Button> : <>
              <Button variant="contained" size="large" component={RouterLink} to="/login" sx={{ mr: 2 }} className="animated-btn">Login</Button>
              <Button variant="outlined" size="large" component={RouterLink} to="/register" className="animated-btn">Register</Button>
            </>}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [tasks, setTasks] = useState([])
  const [teamName, setTeamName] = useState('')
  const [joinId, setJoinId] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [error, setError] = useState('')
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [loadingTasks, setLoadingTasks] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!user) navigate('/login')
    else fetchTeams()
    // eslint-disable-next-line
  }, [])

  async function fetchTeams() {
    try {
      setLoadingTeams(true)
      setTeams(await getTeams(user.id))
      setLoadingTeams(false)
    } catch (err) {
      setError(err.message)
      setLoadingTeams(false)
    }
  }

  async function handleCreateTeam(e) {
    e.preventDefault()
    setError('')
    try {
      await createTeam({ name: teamName, userId: user.id })
      setTeamName('')
      fetchTeams()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleJoinTeam(e) {
    e.preventDefault()
    setError('')
    try {
      await joinTeam({ teamId: joinId, userId: user.id })
      setJoinId('')
      fetchTeams()
    } catch (err) {
      setError(err.message)
    }
  }

  async function selectTeam(team) {
    setSelectedTeam(team)
    setError('')
    try {
      setLoadingTasks(true)
      setTasks(await getTasks(team._id))
      setLoadingTasks(false)
    } catch (err) {
      setError(err.message)
      setLoadingTasks(false)
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault()
    setError('')
    try {
      await createTask({ title: taskTitle, description: taskDesc, team: selectedTeam._id, userId: user.id })
      setTaskTitle('')
      setTaskDesc('')
      selectTeam(selectedTeam)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleStatusChange(task, status) {
    setError('')
    try {
      await updateTask(task._id, { status })
      selectTeam(selectedTeam)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteTask(task) {
    setError('')
    try {
      await deleteTask(task._id)
      selectTeam(selectedTeam)
    } catch (err) {
      setError(err.message)
    }
  }

  function handleLogout() {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f6fa" className="fade-in">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Team Task Tracker</Typography>
          <Button color="inherit" onClick={handleLogout} className="animated-btn">Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Your Teams</Typography>
              {loadingTeams ? <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box> :
                <Box>
                  {teams.map(team => (
                    <Card key={team._id} sx={{ mb: 2, cursor: 'pointer', border: selectedTeam && selectedTeam._id === team._id ? '2px solid #1976d2' : '' }} onClick={() => selectTeam(team)} className="animated-card">
                      <CardContent>
                        <Typography variant="subtitle1">{team.name}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              }
              <Box component="form" onSubmit={handleCreateTeam} sx={{ mt: 2 }}>
                <TextField label="New team name" value={teamName} onChange={e => setTeamName(e.target.value)} fullWidth required size="small" className="animated-input" />
                <Button type="submit" variant="contained" sx={{ mt: 1 }} fullWidth className="animated-btn">Create Team</Button>
              </Box>
              <Box component="form" onSubmit={handleJoinTeam} sx={{ mt: 2 }}>
                <TextField label="Team ID to join" value={joinId} onChange={e => setJoinId(e.target.value)} fullWidth required size="small" className="animated-input" />
                <Button type="submit" variant="outlined" sx={{ mt: 1 }} fullWidth className="animated-btn">Join Team</Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, minHeight: 400 }}>
              {selectedTeam ? <>
                <Typography variant="h6" gutterBottom>Tasks for {selectedTeam.name}</Typography>
                {loadingTasks ? <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box> :
                  <TransitionGroup>
                    {tasks.map(task => (
                      <CSSTransition key={task._id} timeout={400} classNames="task">
                        <Card sx={{ mb: 2 }} className="animated-card">
                          <CardContent>
                            <Typography variant="subtitle1"><b>{task.title}</b></Typography>
                            <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                            <FormControl sx={{ mt: 1, minWidth: 120 }} size="small">
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={task.status}
                                label="Status"
                                onChange={e => handleStatusChange(task, e.target.value)}
                              >
                                <MenuItem value="To Do">To Do</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Done">Done</MenuItem>
                              </Select>
                            </FormControl>
                          </CardContent>
                          <CardActions>
                            <Button color="error" onClick={() => handleDeleteTask(task)} className="animated-btn">Delete</Button>
                          </CardActions>
                        </Card>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                }
                <Box component="form" onSubmit={handleCreateTask} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                      <TextField label="Task title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} fullWidth required size="small" className="animated-input" />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField label="Task description" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} fullWidth size="small" className="animated-input" />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button type="submit" variant="contained" fullWidth className="animated-btn">Add Task</Button>
                    </Grid>
                  </Grid>
                </Box>
              </> : <Typography>Select a team to view tasks.</Typography>}
            </Paper>
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }} className="animated-alert">{error}</Alert>}
      </Container>
    </Box>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await apiLogin({ email, password })
      localStorage.setItem('user', JSON.stringify(res.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f6fa" display="flex" alignItems="center" justifyContent="center" className="fade-in">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="animated-input"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="animated-input"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} className="animated-btn">
            Login
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }} className="animated-alert">{error}</Alert>}
        <Typography variant="body2" mt={2}>
          Don't have an account? <Button component={RouterLink} to="/register" className="animated-btn">Register</Button>
        </Typography>
      </Paper>
    </Box>
  )
}

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await apiRegister({ name, email, password })
      localStorage.setItem('user', JSON.stringify(res.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Box minHeight="100vh" bgcolor="#f5f6fa" display="flex" alignItems="center" justifyContent="center" className="fade-in">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="animated-input"
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="animated-input"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="animated-input"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} className="animated-btn">
            Register
          </Button>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }} className="animated-alert">{error}</Alert>}
        <Typography variant="body2" mt={2}>
          Already have an account? <Button component={RouterLink} to="/login" className="animated-btn">Login</Button>
        </Typography>
      </Paper>
    </Box>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
