(async() => {
 const neo4j = require('neo4j-driver')

 const uri = 'neo4j+s://1bcff91e.databases.neo4j.io';
 const user = 'neo4j';
 const password = '9XaD-zH-7-WxXmOenc3_GyMJHIA-DDZKnDN1zriwn0w';

 const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
 const session = driver.session()
// test comment
 let person1Name = 'Alicia';
 let person2Name = 'Davidid';
 let person3Name = 'Peterpeters';
 let person4Name = 'Lucy2';

const personNameObj = { personName: person1Name};

let entity = "PersonType2"; // this expt shows can set entity labels okay. But is it good approach??
 try {
   // To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
   // The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
   const writeQuery = `MERGE (p1:${entity} { name: $person1Name, age:24})
                       MERGE (p2:Person { name: $person2Name, age:68 })
                       MERGE (p1)-[:KNOWS]->(p2)
                       RETURN p1, p2`

   // Write transactions allow the driver to handle retries and transient errors
   let writeResult = await session.writeTransaction(tx =>
     tx.run(writeQuery, { person1Name, person2Name })
   )
    person1Name = person3Name;
    person2Name = person4Name;

      writeResult = await session.writeTransaction(tx =>
     tx.run(writeQuery, { person1Name, person2Name })
   )


   writeResult.records.forEach(record => {
     const person1Node = record.get('p1')
     const person2Node = record.get('p2')
     console.log(
       `Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`
     )
   })

   const readQuery = `MATCH (p:Person)
                      WHERE p.name = $personName
                      RETURN p.name AS name`


     const readResult = await session.readTransaction(tx =>
     tx.run(readQuery, personNameObj)
   )


   readResult.records.forEach(record => {
     console.log(`Found person: ${record.get('name')}`)
   })



 }

 catch (error) {
   console.error('Something went wrong: ', error)
 }

 finally {
   await session.close()
 }

 // Don't forget to close the driver connection when you're finished with it
 await driver.close()
})();