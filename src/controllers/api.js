const GitHub = require('github-api');

async function getGitHubData(token) {
  const gh = new GitHub({
    token: token
  });

  const me = gh.getUser();
  const repos = await me.listRepos();

  let reposData = await Promise.all(
    repos.data.map(async elem => {
      const owner = elem.owner.login;
      const repo_name = elem.name;

      const repository = gh.getRepo(owner, repo_name);
      const commits = await repository.listCommits();
      const branches = await repository.listBranches();

      const commits_count = commits.data.length;
      const branches_count = branches.data.length;

      return { ...elem, commits_count, branches_count };
    })
  );

  return { repos: reposData };
}

module.exports = getGitHubData;
