const teams = [];

const getTeams = () => teams;

const addTeam = (team) => {
    teams.push(team);
};

const deleteTeam = (id) => {
    const index = teams.findIndex((team) => team.id === id);
    if (index !== -1) {
        teams.splice(index, 1);
    }
};

module.exports = { getTeams, addTeam, deleteTeam };
