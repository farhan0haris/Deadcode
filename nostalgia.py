import os
import subprocess
import datetime

def find_git_repos(root_dir):
    repos = []
    # Avoid scanning deep into heavy directories
    ignore_dirs = {'node_modules', 'venv', '.env', '__pycache__', 'dist', 'build', '.next'}
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Prune ignore dirs
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
        
        if '.git' in dirnames:
            repos.append(dirpath)
            # Don't recurse into .git or sub-repos
            dirnames.remove('.git')
    return repos

def get_commits_on_date(repo_path, target_date):
    """Gets commits on a specific date (YYYY-MM-DD)"""
    start_time = f"{target_date} 00:00:00"
    end_time = f"{target_date} 23:59:59"
    
    cmd = [
        "git",
        "--no-pager",
        "log",
        "--all",
        f"--since={start_time}",
        f"--until={end_time}",
        "--format=%h|%an|%s"
    ]
    
    try:
        # Check if it's a valid git repo (sometimes .git exists but it's empty/broken)
        result = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True, check=True)
        lines = [line.strip() for line in result.stdout.split('\n') if line.strip()]
        return lines
    except subprocess.CalledProcessError:
        return []
    except FileNotFoundError:
        # Git is not installed or not in PATH
        print("Error: Git command not found. Please ensure Git is installed.")
        exit(1)

def main():
    print("🕰️  Welcome to the Code Nostalgia Machine! 🕰️")
    root_directory = input("Enter the directory to scan for Git repos (leave blank for current dir): ").strip()
    if not root_directory:
        root_directory = os.getcwd()

    print(f"\nScanning for Git repositories in: {root_directory}")
    print("This might take a moment depending on the number of projects...\n")

    repos = find_git_repos(root_directory)
    if not repos:
        print("No git repositories found in this directory.")
        return

    today = datetime.date.today()
    
    # Check for the past 5 years
    years_to_check = 5
    found_any = False
    
    for repo in repos:
        repo_name = os.path.basename(repo)
        repo_has_commits = False
        repo_output = []
        
        for years_back in range(1, years_to_check + 1):
            try:
                # Handle leap years safely (e.g., if today is Feb 29, but last year wasn't a leap year)
                target_date = today.replace(year=today.year - years_back)
            except ValueError:
                target_date = today.replace(year=today.year - years_back, day=28)
                
            commits = get_commits_on_date(repo, target_date.strftime("%Y-%m-%d"))
            
            if commits:
                repo_has_commits = True
                repo_output.append(f"  [{years_back} year(s) ago today - {target_date.strftime('%b %d, %Y')}]")
                for commit in commits:
                    parts = commit.split('|', 2)
                    if len(parts) == 3:
                        repo_output.append(f"    - {parts[0]} by {parts[1]}: {parts[2]}")
                    else:
                        repo_output.append(f"    - {commit}")
                        
        if repo_has_commits:
            found_any = True
            print(f"📁 Repository: {repo_name} ({repo})")
            for line in repo_output:
                print(line)
            print("-" * 50)
            
    if not found_any:
        print(f"No commits found on {today.strftime('%B %d')} in the past {years_to_check} years across {len(repos)} repositories.")
    else:
        print("Hope you enjoyed this trip down memory lane! 🚀")

if __name__ == "__main__":
    main()
