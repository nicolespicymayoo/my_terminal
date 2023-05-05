type Link = {
  type: "link"
  name: string
  link: string
}

type File = {
  type: "file"
  name: string
  value: string
}

export type Folder = {
  type: "folder"
  name: string
  children: Array<Folder | File | Link>
}

let folder = (name: string, children: Folder["children"]): Folder => ({
  type: "folder",
  name,
  children
})

let file = (name: string, value: string): File => ({
  type: "file",
  name,
  value
})

let link = (name: string, link: string): Link => ({ type: "link", name, link })

const skills = [
  'TypeScript', 
  'JavaScript(ES6+)',
  'React',
  'Redux',
  'CSS/SCSS',
  'Styled Components',
  'GraphQL',
  'Apollo Client',
  'Next.js',
  'Node.js',
  'PostgreSQL',
]

const skillsStringWithLineBreaks = skills.toString().split(',').join('<br />')

export const rootFolder = folder("root", [
  file(
    "about",
    "Hi! Welcome to my terminal ✨ I'm Nicole, a frontend software engineer. I love to build modern, aesthetic, delightful user interfaces. I have 5 years experience building web applications with React and TypeScript. Check out my favorite technologies by typing `skills`. Or `cd` into the `links` folder to see more info"
  ),
  file(
    "skills",
    skillsStringWithLineBreaks
  ),
  folder("links", [
    link("github", "https://github.com/nicolespicymayoo"),
    link("linkedin", "https://www.linkedin.com/in/nicolemayo/"),
    link("resume", "https://drive.google.com/file/d/1PrGbn7yF72mGYXOK0uZGBHjHI_WsTyiv/view"),
    link("twitter", "https://twitter.com/spicyasianmayo?lang=en")
  ]),
  file("email", " Shoot me an email at hellonicolemayo@gmail.com. I'd love to chat!")
])
