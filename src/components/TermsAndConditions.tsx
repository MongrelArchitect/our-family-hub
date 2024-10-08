import Card from "./Card";

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col gap-4">
      <Card
        borderColor="border-blue-400"
        headingColor="bg-blue-200"
        heading="Terms and Conditions"
      >
        <div className="flex flex-col gap-4">
          <p className="font-bold">Welcome to Our Family Hub!</p>
          <p>
            By using this site, you agree to the following terms. Please read
            them carefully.
          </p>

          <div className="flex flex-col">
            <h3 className="font-bold">1. Your Content</h3>
            <p>
              Our Family Hub is a platform for you to create private "families"
              and share content (like posts, events, and images) within them.
              All content is user-generated, and we are not responsible for
              anything shared within your families. You are responsible for
              ensuring that your content complies with any applicable laws.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold">2. Site Development</h3>
            <p>
              Our Family Hub is currently in active development. This means that
              features may change, break, or be removed entirely at any time. We
              strive to improve the site, but we cannot guarantee that
              everything will work perfectly or that your data will always be
              safe or available. Use the site at your own risk.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold">3. Privacy and Security</h3>
            <p>
              We do our best to keep your data private - for example, profile
              images are only visible to family members. However, we cannot
              guarantee complete privacy or security. Please use caution when
              sharing sensitive information. We don’t share your data with any
              third parties for now, but this may change in the future.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold">4. No Age Restrictions</h3>
            <p>
              There are no age restrictions for using Our Family Hub beyond what
              is required by law. You are responsible for ensuring that your use
              of the site complies with any applicable age restrictions.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold">5. Future Changes</h3>
            <p>
              These terms and conditions are subject to change at any time
              without any prior notice. By continuing to use the site you agree
              to any future changes.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold">6. Liability</h3>
            <p>
              Our Family Hub cannot be held liable for any errors, bugs, or data
              loss you might experience while using the site. We provide no
              guarantees of data integrity or availability.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold">Contact Us</h3>
            <p>
              If you have any questions or concerns, feel free to reach out by
              email:{" "}
              <a
                className="font-bold text-violet-800 hover:underline focus:underline"
                href="mailto:sean@ourfamilyhub.net"
              >
                sean@ourfamilyhub.net
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
