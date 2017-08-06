require 'time'

desc 'create a new draft post'
task :post do
    title = ENV['TITLE']

    if !title
        puts "post should have a title"
        next
    end

    slug = "#{Date.today}-#{title.downcase.gsub(/[^\w]+/, '-')}"

    file = File.join(
        File.dirname(__FILE__),
        '_posts',
        slug + '.md'
    )

    File.open(file, "w") do |f|
        f << <<-EOS.gsub(/^     /, '')
        ---
        layout: post
        title: #{title}
        published: false
        comments: false
        ---
        EOS
    end
end
