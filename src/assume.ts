const completionSpec: Fig.Spec = {
  name: "assume",
  description:
    "Granted is a command line interface (CLI) tool which simplifies access to cloud roles and allows multiple cloud accounts to be opened in your web browser simultaneously",
  priority: 100,
  generateSpec(tokens, executeShellCommand) {
    return new Promise(async (resolve, reject) => {
      // get profiles from ~/.aws/config
      const profiles = (
        await executeShellCommand(
          "cat ~/.aws/config | sed -n -e 's/.*\\[profile \\(.*\\)\\].*/\\1/p'"
        )
      )
        .split("\n")
        .filter(Boolean);

      // OPTIONS GENERATION STEP
      const commandOutput = await executeShellCommand("assume -h");
      // split by newline and filter
      const lines = commandOutput
        .split("\n")
        .filter((line) => line.includes(" --"));

      // map lines to objects
      const options = lines.map((line) => {
        // match option names
        const nameMatch = line.match(/(--\w+|-\w+)/g);
        const names = nameMatch ? nameMatch : [];
        // to string[]
        names.map((name) => name.trim());

        // match description
        const descriptionMatch = line.match(/[a-z].*(\(default:.*)$/i);
        const description = descriptionMatch ? descriptionMatch[0] : "";

        return {
          name: names,
          description: description,
        };
      });

      resolve({
        name: "assume",
        description:
          "Granted is a command line interface (CLI) tool which simplifies access to cloud roles and allows multiple cloud accounts to be opened in your web browser simultaneously",
        subcommands: profiles.map((profile) => {
          return {
            name: profile,
            description: "Assume role for " + profile,
            options: [
              {
                name: ["--help", "-h"],
                description: "Show help for assume",
              },
              ...options,
            ],
          };
        }),
      });
    });
  },
  options: [
    {
      name: ["--help", "-h"],
      description: "Show help for assume",
    },
  ],
  // Only uncomment if assume takes an argument
  // args: {}
};
export default completionSpec;
