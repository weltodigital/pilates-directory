import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Star, Award, Users, Clock, MapPin } from 'lucide-react'

interface EnhancedContentProps {
  content: string
  locationName: string
}

interface SectionData {
  heading: string | null
  content: string
  listItems?: Array<{ label: string; description: string }>
  hasListPattern?: boolean
  isIntro: boolean
}

export default function EnhancedContent({ content, locationName }: EnhancedContentProps) {
  // Parse the HTML content to extract sections
  const parseContent = (htmlContent: string): SectionData[] => {
    const sections: SectionData[] = []

    // Split content by headings and process
    const parts = htmlContent.split(/(?=<h[1-6][^>]*>)/i)

    for (const part of parts) {
      if (!part.trim()) continue

      const headingMatch = part.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i)
      const heading = headingMatch ? headingMatch[1] : null

      // Extract content after heading
      let sectionContent = part
      if (heading) {
        sectionContent = part.replace(/<h[1-6][^>]*>[^<]+<\/h[1-6]>/i, '').trim()
      }

      // Check if content contains list-like patterns
      const hasListPattern = /(?:^|\s)([A-Z][^:]*:)(?:\s|$)/gm.test(sectionContent)
      let listItems = []
      let cleanContent = ''

      if (hasListPattern) {
        // Extract list items with colon pattern
        const matches = sectionContent.match(/([A-Z][^:]*:[^A-Z]*?)(?=\s[A-Z][^:]*:|$)/g)
        if (matches) {
          listItems = matches.map(item => {
            const [label, ...descParts] = item.split(':')
            return {
              label: label.trim(),
              description: descParts.join(':').trim()
            }
          })
        }
      } else {
        // Clean up HTML tags for regular content
        cleanContent = sectionContent
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      }

      if (cleanContent || listItems.length > 0) {
        sections.push({
          heading,
          content: cleanContent,
          listItems,
          hasListPattern,
          isIntro: !heading && sections.length === 0
        })
      }
    }

    return sections
  }

  // Define icons for different section types
  const getSectionIcon = (heading: string | null) => {
    if (!heading) return null

    const lowerHeading = heading.toLowerCase()
    if (lowerHeading.includes('quality') || lowerHeading.includes('fresh')) return Star
    if (lowerHeading.includes('service') || lowerHeading.includes('community')) return Users
    if (lowerHeading.includes('specialized') || lowerHeading.includes('available')) return CheckCircle
    if (lowerHeading.includes('local') || lowerHeading.includes('support')) return Award
    if (lowerHeading.includes('delivery') || lowerHeading.includes('opening')) return Clock
    return MapPin
  }

  const sections = parseContent(content)

  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        if (section.isIntro) {
          return (
            <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Premium Pilates Studios in {locationName}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          )
        }

        const IconComponent = getSectionIcon(section.heading)

        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                {IconComponent && (
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-purple-600" />
                  </div>
                )}
                <span className="text-gray-900">{section.heading}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.heading?.toLowerCase().includes('specialized') ||
               section.heading?.toLowerCase().includes('available') ? (
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Professional pilates studios in {locationName} typically offer:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Reformer pilates classes for all levels',
                      'Mat pilates and classical instruction',
                      'Clinical pilates for injury rehabilitation',
                      'Prenatal and postnatal specialized classes',
                      'Private sessions and personalized programs',
                      'Online booking and flexible scheduling',
                      'Workshops and continuing education programs'
                    ].map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : section.hasListPattern && section.listItems?.length > 0 ? (
                <div className="space-y-3">
                  {section.listItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">{item.label}:</span>
                        <span className="text-gray-700 ml-1">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* Key Benefits Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Why Choose {locationName} Pilates Studios?
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Expert Instruction</h4>
              <p className="text-gray-600 text-sm">
                Certified instructors with comprehensive training in classical and contemporary pilates
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personal Attention</h4>
              <p className="text-gray-600 text-sm">
                Small class sizes and personalized programs tailored to your fitness goals
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Wellness Community</h4>
              <p className="text-gray-600 text-sm">
                Supporting holistic health and building stronger, more mindful communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}