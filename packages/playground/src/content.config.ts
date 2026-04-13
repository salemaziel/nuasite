import { n } from '@nuasite/cms'
import { glob } from 'astro/loaders'
import { defineCollection, reference } from 'astro:content'

const servicesCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/services' }),
	schema: n.object({
		title: n.text().nullable(),
		subtitle: n.text().nullable(),
		heroImageDesktop: n.image().nullable(),
		heroImageMobile: n.image().nullable(),
		stats: n.array(n.object({
			value: n.text(),
			label: n.text(),
		})),
		ctaText: n.text().nullable(),
		ctaLink: n.url().nullable(),
	}),
})

const tagsCollection = defineCollection({
	loader: glob({ pattern: '**/*.json', base: 'src/content/tags' }),
	schema: n.object({
		name: n.text(),
	}),
})

const blogCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/blog' }),
	schema: n.object({
		title: n.text(),
		author: n.string(),
		date: n.date().orderBy('desc'),
		tags: n.array(reference('tags')),
		excerpt: n.textarea(),
		coverImage: n.image(),
	}),
})

const teamCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/team' }),
	schema: n.object({
		name: n.text({ placeholder: 'Full name' }),
		role: n.text({ placeholder: 'Job title' }),
		bio: n.textarea({ rows: 4, maxLength: 500 }),
		avatar: n.image(),
		order: n.number({ min: 1, max: 100, step: 1 }).orderBy('asc'),
		social: n.object({
			twitter: n.text().optional(),
			github: n.text().optional(),
			linkedin: n.text().optional(),
		}),
	}),
})

const projectsCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/projects' }),
	schema: n.object({
		title: n.text({ placeholder: 'Project name' }),
		client: n.text({ placeholder: 'Client name' }),
		date: n.coerce.date(),
		tags: n.array(reference('tags')),
		coverImage: n.text(),
		url: n.text().nullable(),
		featured: n.boolean().default(false),
	}),
})

export const collections = {
	tags: tagsCollection,
	services: servicesCollection,
	blog: blogCollection,
	team: teamCollection,
	projects: projectsCollection,
}
