import { LinearClient } from "@linear/sdk";

async function main() {
  const client = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });

  try {
    const issues = await client.issues({ first: 100 });

    let count = 0;
    let list = issues;
    while (list.pageInfo.hasNextPage) {
      const { nodes: issues } = list;

      for (const issue of issues) {
        if (
          (issue.estimate === undefined || issue.estimate === null) && ((await issue.team).id === "DEV")
        ) {
          console.log(
            `<a href="${issue.url}">${issue.identifier}: ${issue.title}</a>`
          );
        }
      }

      if (list.pageInfo.hasNextPage) {
        list =  await list.fetchNext();
        count += list.nodes.length;
      }
    }

    console.log(`${count} records found.`);
  } catch (error) {
    console.error(error);
  }
}

main();
