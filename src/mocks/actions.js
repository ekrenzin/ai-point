export const spanishText = `
El planeta Tierra es nuestro hogar, el lugar donde vivimos y nos desarrollamos. Es el tercer planeta más cercano al Sol, y el quinto en tamaño. Tiene una edad de aproximadamente 4.5 mil millones de años y es el único planeta conocido que tiene vida. La Tierra es un lugar sorprendente y mágico, lleno de maravillas naturales que nos asombran a diario.

El planeta Tierra tiene una superficie total de 510.072.000 kilómetros cuadrados y está compuesto por tres capas principales: la corteza terrestre, el manto y el núcleo. La corteza terrestre es la capa más externa, donde se encuentran los continentes y los océanos. El manto es una capa intermedia que se encuentra debajo de la corteza, y el núcleo es la capa más interna, compuesta por hierro y níquel.

La Tierra es el único planeta conocido que tiene agua líquida en su superficie, lo que es esencial para la vida. El 71% de la superficie de la Tierra está cubierta por agua, mientras que el 29% restante es tierra. La Tierra tiene una atmósfera que está compuesta principalmente por nitrógeno, oxígeno y dióxido de carbono. La atmósfera es esencial para la vida en la Tierra, ya que nos protege de la radiación solar y mantiene la temperatura adecuada para que la vida pueda prosperar.

La Tierra es el hogar de millones de especies de plantas y animales. Desde la fauna marina hasta los animales terrestres, cada especie desempeña un papel importante en el ecosistema de la Tierra. La Tierra también tiene una gran variedad de paisajes naturales, desde las montañas hasta los bosques y los desiertos.

Sin embargo, la Tierra también enfrenta una serie de desafíos ambientales. La contaminación del aire y del agua, la deforestación, el cambio climático y la pérdida de biodiversidad son solo algunos de los problemas que enfrenta nuestro planeta. Es importante que todos hagamos nuestra parte para proteger la Tierra y mantenerla en buen estado para las generaciones futuras.

En conclusión, la Tierra es un planeta asombroso y único que nos brinda todo lo que necesitamos para vivir. Es nuestra responsabilidad proteger y cuidar este hermoso planeta para que las generaciones futuras también puedan disfrutar de su belleza y riqueza natural.
`

export const docs = `
async function createCompletion(prompt, content) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt.base + content + prompt.end,
        temperature: 0.6,
        max_tokens: 500,
    });
    return completion
}
`